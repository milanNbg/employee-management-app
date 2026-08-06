import { useEffect, useRef } from 'react'
import type { MouseEvent, SyntheticEvent } from 'react'
import { EmployeeForm } from './EmployeeForm'
import type { CreateEmployeeFormValues } from '../schemas/employeeSchema'

interface EmployeeFormDialogProps {
  onSubmit: (values: CreateEmployeeFormValues) => Promise<void> | void
  onClose: () => void
  isSubmitting: boolean
  submissionError?: string | null
}

export function EmployeeFormDialog({
  onSubmit,
  onClose,
  isSubmitting,
  submissionError,
}: EmployeeFormDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const firstNameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    dialog.showModal()
    firstNameInputRef.current?.focus()

    return () => {
      if (dialog.open) {
        dialog.close()
      }
    }
  }, [])

  const handleCancel = (
    event: SyntheticEvent<HTMLDialogElement, Event>,
  ) => {
    event.preventDefault()

    if (!isSubmitting) {
      onClose()
    }
  }

  const handleBackdropClick = (
    event: MouseEvent<HTMLDialogElement>,
  ) => {
    if (event.target !== event.currentTarget || isSubmitting) {
      return
    }

    onClose()
  }

  return (
    <dialog
      className="employee-form-dialog"
      ref={dialogRef}
      aria-labelledby="employee-form-dialog-title"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      <div className="employee-form-dialog-content">
        <div className="employee-form-dialog-header">
          <h2 id="employee-form-dialog-title">Add employee</h2>
          <p>Enter the employee details to add them to the directory.</p>
        </div>
        <EmployeeForm
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          submissionError={submissionError}
          firstNameInputRef={firstNameInputRef}
        />
      </div>
    </dialog>
  )
}
