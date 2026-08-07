import { useEffect, useRef } from 'react'

interface ToastProps {
  message: string
  onClose: () => void
}

export function Toast({ message, onClose }: ToastProps) {
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onCloseRef.current()
    }, 3500)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [message])

  return (
    <div className="app-toast" role="status" aria-live="polite">
      <span className="app-toast-icon" aria-hidden="true">
        <svg viewBox="0 0 20 20" focusable="false">
          <path d="M8.4 13.2 4.9 9.7l1.4-1.4 2.1 2.1 5.3-5.3 1.4 1.4-6.7 6.7Z" />
        </svg>
      </span>
      <span>{message}</span>
      <button type="button" aria-label="Dismiss notification" onClick={onClose}>
        <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          <path d="m6.3 5.2 3.7 3.7 3.7-3.7 1.1 1.1-3.7 3.7 3.7 3.7-1.1 1.1-3.7-3.7-3.7 3.7-1.1-1.1L8.9 10 5.2 6.3l1.1-1.1Z" />
        </svg>
      </button>
    </div>
  )
}
