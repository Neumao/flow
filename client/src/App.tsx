import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import { LoginForm } from './components/login-form'
import { SignupForm } from './components/signup-form'
import { ForgetPasswordForm } from './components/forget-password-form'
import LayoutPage from './layout/layout'
import { AuthGuard } from './components/auth/AuthGuard'

function App() {
  return (
    <main style={{ flex: 1 }}>
      <AuthGuard>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/forget-password" element={<ForgetPasswordForm />} />
          <Route path="/layout/*" element={<LayoutPage />} />
        </Routes>
      </AuthGuard>
    </main>
  )
}

export default App
