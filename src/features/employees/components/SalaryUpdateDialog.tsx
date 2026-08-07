import { useEffect, useRef } from 'react'
import type { MouseEvent, SyntheticEvent } from 'react'
import { SalaryUpdateForm } from './SalaryUpdateForm'
import type { UpdateEmployeeSalaryFormValues } from '../schemas/employeeSchema'

interface SalaryUpdateDialogProps {
  currentSalary: number
  onSubmit: (values: UpdateEmployeeSalaryFormValues) => Promise<void> | void
  onClose: () => void
  isSubmitting: boolean
  submissionError?: string | null
}

export function SalaryUpdateDialog({
  currentSalary,
  onSubmit,
  onClose,
  isSubmitting,
  submissionError,
}: SalaryUpdateDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const salaryInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    dialog.showModal()
    salaryInputRef.current?.focus()

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
      aria-labelledby="salary-update-dialog-title"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      <div className="employee-form-dialog-content">
        <div className="employee-form-dialog-header">
          <h2 id="salary-update-dialog-title">Update salary</h2>
          <p>Enter a new salary for this employee.</p>
        </div>
        <SalaryUpdateForm
          currentSalary={currentSalary}
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          submissionError={submissionError}
          salaryInputRef={salaryInputRef}
        />
      </div>
    </dialog>
  )
}
