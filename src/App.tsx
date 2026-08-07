import './App.css'
import { Navigate, Route, Routes } from 'react-router'
import { EmployeeDetailsPage } from './features/employees/pages/EmployeeDetailsPage'
import { EmployeesPage } from './features/employees/pages/EmployeesPage'
import { RecordingPage } from './features/recording/pages/RecordingPage'
import { NotFoundPage } from './pages/NotFoundPage'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/employees" replace />} />
      <Route path="/employees" element={<EmployeesPage />} />
      <Route
        path="/employees/:employeeId"
        element={<EmployeeDetailsPage />}
      />
      <Route path="/recording" element={<RecordingPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
