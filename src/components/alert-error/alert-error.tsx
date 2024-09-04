import { Alert } from 'antd'
import { useEffect } from 'react'

import styles from './alert-error.module.scss'

interface ErrorAlertProps {
  errorMessage: string
  onClose?: () => void
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const ErrorAlert: React.FC<ErrorAlertProps> = ({ errorMessage, onClose = () => {} }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.()
    }, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={styles.errorMessage}>
      <Alert message={errorMessage} type="error" closable />
    </div>
  )
}

export default ErrorAlert
