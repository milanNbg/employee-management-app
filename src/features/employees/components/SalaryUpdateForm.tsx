import { useState } from 'react'
import type { ChangeEvent, FormEvent, Ref } from 'react'
import {
  updateEmployeeSalaryFormSchema,
  type UpdateEmployeeSalaryFormValues,
} from '../schemas/employeeSchema'
import { formatSalary } from '../utils/employeeFormatters'

interface SalaryUpdateFormProps {
  currentSalary: number
  onSubmit: (values: UpdateEmployeeSalaryFormValues) => Promise<void> | void
  onCancel: () => void
  isSubmitting: boolean
  submissionError?: string | null
  salaryInputRef?: Ref<HTMLInputElement>
}

interface SalaryUpdateFormState {
  salary: string
}

type SalaryUpdateFormErrors = Partial<Record<keyof SalaryUpdateFormState, string>>

const initialFormState: SalaryUpdateFormState = {
  salary: '',
}

function getFieldErrors(
  result: ReturnType<typeof updateEmployeeSalaryFormSchema.safeParse>,
): SalaryUpdateFormErrors {
  if (result.success) {
    return {}
  }

  return result.error.issues.reduce<SalaryUpdateFormErrors>((errors, issue) => {
    const field = issue.path[0]

    if (field === 'salary' && !errors.salary) {
      errors.salary = issue.message
    }

    return errors
  }, {})
}

export function SalaryUpdateForm({
  currentSalary,
  onSubmit,
  onCancel,
  isSubmitting,
  submissionError,
  salaryInputRef,
}: SalaryUpdateFormProps) {
  const [formValues, setFormValues] = useState<SalaryUpdateFormState>(
    initialFormState,
  )
  const [fieldErrors, setFieldErrors] = useState<SalaryUpdateFormErrors>({})

  const salaryErrorId = fieldErrors.salary
    ? 'employee-new-salary-error'
    : undefined

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setFormValues({
      salary: event.target.value,
    })

    setFieldErrors({})
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationResult = updateEmployeeSalaryFormSchema.safeParse(
      formValues,
    )
    const nextFieldErrors = getFieldErrors(validationResult)

    if (
      validationResult.success &&
      validationResult.data.salary === currentSalary
    ) {
      nextFieldErrors.salary =
        'New salary must be different from the current salary.'
    }

    setFieldErrors(nextFieldErrors)

    if (!validationResult.success || nextFieldErrors.salary) {
      return
    }

    await onSubmit(validationResult.data)
  }

  return (
    <form className="employee-form" onSubmit={handleSubmit} noValidate>
      <p className="salary-update-current">
        Current salary: <strong>{formatSalary(currentSalary)}</strong>
      </p>

      <div className="employee-form-grid">
        <div className="employee-form-field">
          <label htmlFor="employee-new-salary">New salary (EUR)</label>
          <input
            id="employee-new-salary"
            ref={salaryInputRef}
            name="salary"
            type="number"
            value={formValues.salary}
            placeholder="4500"
            min={0}
            max={10_000_000}
            step={1}
            inputMode="numeric"
            required
            disabled={isSubmitting}
            aria-invalid={Boolean(fieldErrors.salary)}
            aria-describedby={salaryErrorId}
            onChange={handleInputChange}
          />
          {fieldErrors.salary && (
            <p className="employee-form-error" id="employee-new-salary-error">
              {fieldErrors.salary}
            </p>
          )}
        </div>
      </div>

      {submissionError && (
        <p className="employee-form-submit-error" role="alert">
          {submissionError}
        </p>
      )}

      <div className="employee-form-actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update salary'}
        </button>
        <button type="button" disabled={isSubmitting} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
