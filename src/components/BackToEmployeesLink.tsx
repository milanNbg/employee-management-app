import { Link } from 'react-router'

export function BackToEmployeesLink() {
  return (
    <Link className="app-link app-back-link" to="/employees">
      <span className="app-back-link-arrow" aria-hidden="true">
        ←
      </span>
      <span>Back to employees</span>
    </Link>
  )
}
