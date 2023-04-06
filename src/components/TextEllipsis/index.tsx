import {useCallback, useLayoutEffect, useMemo, useRef, useState} from 'react'

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

    const [prefix, setPrefix] = useState('')
    const [hiddenText, setHiddenText] = useState('')
    const [postfix, setPostfix] = useState('')

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
                    if (postfix.length >= fittingTextLength) {
                        const middleIndex = children.length - fittingTextLength

                        setPrefix('')
                        setHiddenText(children.substring(0, middleIndex))
                        setPostfix(children.substring(middleIndex))
                    } else {
                        const middleIndex = fittingTextLength - postfix.length - 3

                        setPrefix(children.substring(0, middleIndex))
                        setHiddenText(children.substring(middleIndex, children.length - tailLength))
                        setPostfix(postfix)
                    }
                } else {
                    setPrefix(children)
                    setPostfix('')
                    setHiddenText('')
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

    const handleCopy: ClipboardEventHandler = (event) => {
        event.preventDefault()
        event.clipboardData.setData('text/plain', window.getSelection().toString().split('\n')[0])
    }

    return (
        <div ref={containerRef}
             style={{display: 'flex', whiteSpace: 'nowrap'}}
             className={className}
             title={hiddenText ? title : ''}
             onCopy={handleCopy}
        >
                <span>
                    {prefix}
                    <span style={{fontSize: 0}}>{hiddenText}{postfix}</span>
                </span>
            {hiddenText && <span style={{userSelect: 'none'}}>...</span>}
            {postfix}
        </div>
    )
}

export default TextEllipsis