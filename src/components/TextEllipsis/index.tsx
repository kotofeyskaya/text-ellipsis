import {useLayoutEffect, useMemo, useRef, useState} from 'react'

type TextEllipsisProps = {
    children: string
    tailLength: number
    title?: string
    className?: string
}

const isString = (data: unknown): data is string => typeof data === 'string'

const TextEllipsis = ({children, tailLength, title, className}: TextEllipsisProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const childrenWidthRef = useRef<number>()
    const timeout = useRef<ReturnType<typeof setTimeout>>()

    const [text, setText] = useState(children)
    const [isTitleVisible, setIsTitleVisible] = useState(false)

    const context = useMemo(() => {
        const canvas = document.createElement('canvas')
        return canvas.getContext('2d')
    }, [])

    useLayoutEffect(() => {
        const {current} = containerRef

        if (!current || !isString(children) || !context) return

        if (!childrenWidthRef.current) {
            context.font = getComputedStyle(current).font

            childrenWidthRef.current = context.measureText(children).width
        }

        const childrenWidth = childrenWidthRef.current

        const action = () => {
            timeout.current && clearTimeout(timeout.current)

            timeout.current = setTimeout(() => {
                const postfix = children.substring(children.length - tailLength)
                const containerWidth = current.getBoundingClientRect().width

                const charSize = childrenWidth / children.length
                const fittingTextLength = containerWidth / charSize

                if (childrenWidth > containerWidth) {
                    const truncatedText = postfix.length >= fittingTextLength
                        ? `...${children.substring(children.length - fittingTextLength)}`
                        : `${children.substring(0, fittingTextLength - postfix.length - 3)}...${postfix}`

                    setText(truncatedText)
                    setIsTitleVisible(true)
                } else {
                    setText(children)
                    setIsTitleVisible(false)
                }
            }, 100)
        }

        const observer = new ResizeObserver(action)
        observer.observe(current)

        action()

        return () => {
            timeout.current && clearTimeout(timeout.current)
            observer.disconnect()
        }
    }, [children, tailLength, context])

    return (
        <div ref={containerRef}
             style={{whiteSpace: 'nowrap'}}
             className={className}
             title={isTitleVisible ? title : ''}
        >
            {text}
        </div>
    )
}

export default TextEllipsis