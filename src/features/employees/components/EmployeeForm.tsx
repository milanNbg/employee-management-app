import { useState } from 'react'
import type { ChangeEvent, FormEvent, Ref } from 'react'
import {
  createEmployeeFormSchema,
  type CreateEmployeeFormValues,
} from '../schemas/employeeSchema'

interface EmployeeFormProps {
  onSubmit: (values: CreateEmployeeFormValues) => Promise<void> | void
  onCancel: () => void
  isSubmitting: boolean
  submissionError?: string | null
  firstNameInputRef?: Ref<HTMLInputElement>
}

interface EmployeeFormState {
  firstName: string
  lastName: string
  salary: string
}

type EmployeeFormField = keyof EmployeeFormState

type EmployeeFormErrors = Partial<Record<EmployeeFormField, string>>

const initialFormState: EmployeeFormState = {
  firstName: '',
  lastName: '',
  salary: '',
}

function isEmployeeFormField(value: unknown): value is EmployeeFormField {
  return value === 'firstName' || value === 'lastName' || value === 'salary'
}

function getFieldErrors(
  result: ReturnType<typeof createEmployeeFormSchema.safeParse>,
): EmployeeFormErrors {
  if (result.success) {
    return {}
  }

  return result.error.issues.reduce<EmployeeFormErrors>((errors, issue) => {
    const field = issue.path[0]

    if (isEmployeeFormField(field) && !errors[field]) {
      errors[field] = issue.message
    }

    return errors
  }, {})
}

export function EmployeeForm({
  onSubmit,
  onCancel,
  isSubmitting,
  submissionError,
  firstNameInputRef,
}: EmployeeFormProps) {
  const [formValues, setFormValues] = useState<EmployeeFormState>(
    initialFormState,
  )
  const [fieldErrors, setFieldErrors] = useState<EmployeeFormErrors>({})

  const firstNameErrorId = fieldErrors.firstName
    ? 'employee-first-name-error'
    : undefined
  const lastNameErrorId = fieldErrors.lastName
    ? 'employee-last-name-error'
    : undefined
  const salaryErrorId = fieldErrors.salary
    ? 'employee-salary-error'
    : undefined

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target

    if (!isEmployeeFormField(name)) {
      return
    }

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))

    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationResult = createEmployeeFormSchema.safeParse(formValues)
    const nextFieldErrors = getFieldErrors(validationResult)
    setFieldErrors(nextFieldErrors)

    if (!validationResult.success) {
      return
    }

    await onSubmit(validationResult.data)
  }

  return (
    <form className="employee-form" onSubmit={handleSubmit} noValidate>
      <div className="employee-form-grid">
        <div className="employee-form-field">
          <label htmlFor="employee-first-name">First name</label>
          <input
            id="employee-first-name"
            ref={firstNameInputRef}
            name="firstName"
            type="text"
            value={formValues.firstName}
            minLength={2}
            maxLength={50}
            required
            disabled={isSubmitting}
            autoComplete="given-name"
            aria-invalid={Boolean(fieldErrors.firstName)}
            aria-describedby={firstNameErrorId}
            onChange={handleInputChange}
          />
          {fieldErrors.firstName && (
            <p className="employee-form-error" id="employee-first-name-error">
              {fieldErrors.firstName}
            </p>
          )}
        </div>

        <div className="employee-form-field">
          <label htmlFor="employee-last-name">Last name</label>
          <input
            id="employee-last-name"
            name="lastName"
            type="text"
            value={formValues.lastName}
            minLength={2}
            maxLength={50}
            required
            disabled={isSubmitting}
            autoComplete="family-name"
            aria-invalid={Boolean(fieldErrors.lastName)}
            aria-describedby={lastNameErrorId}
            onChange={handleInputChange}
          />
          {fieldErrors.lastName && (
            <p className="employee-form-error" id="employee-last-name-error">
              {fieldErrors.lastName}
            </p>
          )}
        </div>

        <div className="employee-form-field">
          <label htmlFor="employee-salary">Salary (EUR)</label>
          <input
            id="employee-salary"
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
            <p className="employee-form-error" id="employee-salary-error">
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
          {isSubmitting ? 'Saving...' : 'Save employee'}
        </button>
        <button type="button" disabled={isSubmitting} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
