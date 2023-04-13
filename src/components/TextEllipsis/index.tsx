import {useLayoutEffect, useMemo, useRef, useState} from 'react'
import styles from './TextEllipsis.module.css'

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

    const [prefix, setPrefix] = useState('')
    const [hiddenText, setHiddenText] = useState('')
    const [postfix, setPostfix] = useState('')

    const [hasOverflow, setHasOverflow] = useState(false)

    const context = useMemo(() => {
        const canvas = document.createElement('canvas')
        return canvas.getContext('2d')
    }, [])

    useLayoutEffect(() => {
        const {current: container} = containerRef

        if (!container || !isString(children) || !context) return

        if (!childrenWidthRef.current) {
            context.font = getComputedStyle(container).font
            childrenWidthRef.current = context.measureText(children).width
        }

        const {current: childrenWidth} = childrenWidthRef

        const charSize = childrenWidth / children.length

        const action: ResizeObserverCallback = (entries) => {
            const postfix = children.substring(children.length - tailLength)
            const containerWidth = entries[0].contentRect.width
            const fittingTextLength = containerWidth / charSize

            const hasOverflow = childrenWidth > containerWidth
            setHasOverflow(hasOverflow)

            if (tailLength <= 0 || !hasOverflow) {
                return
            }

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
        }

        const observer = new ResizeObserver(action)
        observer.observe(container)

        return () => {
            observer.disconnect()
        }
    }, [children, tailLength, context])

    return (
        <div ref={containerRef}
             className={[styles.container, className].join('')}
             title={hasOverflow ? title : ''}
        >
            {
                tailLength <= 0 || !hasOverflow
                    ? <span className={styles.ellipsis}>{children}</span>
                    : (
                        <span>
                            {prefix}
                            <span className={hiddenText ? styles.hiddenWrapper : undefined}>
                                <span className={styles.hiddenText}>{hiddenText}</span>
                            </span>
                            {postfix}
                        </span>
                    )
            }
        </div>
    )
}

export default TextEllipsis