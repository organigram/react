import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'

type AnimatedProps = {
  visible?: boolean
  delay?: number
  children: ReactNode
  translateY?: number
  cursor?: CSSProperties['cursor']
}

const transitionMs = 300

export const Animated: React.FC<AnimatedProps> = ({
  visible = true,
  delay = 0,
  children,
  translateY = 8,
  cursor = 'inherit'
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay, visible])

  if (!visible) return null

  return (
    <div
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : `translateY(${translateY}px)`,
        transition: `opacity ${transitionMs}ms ease, transform 0.5s ease`,
        cursor,
        pointerEvents: mounted ? 'auto' : 'none'
      }}
    >
      {children}
    </div>
  )
}
