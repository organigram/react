import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'

type AnimatedProps = {
  visible?: boolean
  delay?: number
  children: ReactNode
  translateY?: number
  cursor?: CSSProperties['cursor']
  unmountOnExit?: boolean
}

const transitionMs = 300

export const Animated: React.FC<AnimatedProps> = ({
  visible = true,
  delay = 0,
  children,
  translateY = 8,
  cursor = 'inherit',
  unmountOnExit = true
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!visible) return

    const timer = setTimeout(() => {
      setMounted(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay, visible])

  if (!visible && unmountOnExit) return null

  return (
    <div
      style={{
        opacity: mounted && visible ? 1 : 0,
        transform:
          mounted && visible ? 'translateY(0)' : `translateY(${translateY}px)`,
        transition: `opacity ${transitionMs}ms ease, transform 0.5s ease`,
        cursor,
        pointerEvents: mounted && visible ? 'auto' : 'none'
      }}
    >
      {children}
    </div>
  )
}
