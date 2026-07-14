import AuthLayout from '../components/auth/AuthLayout'
import SignUpWizard from '../components/auth/SignUpWizard'
import type { Session } from '../types'

interface RegisterProps {
  onAuthenticated: (session: Session) => void
  onNavigateLogin: () => void
}

// Screen-level view: renders the split-screen auth shell + the 3-step wizard.
export default function Register({ onAuthenticated, onNavigateLogin }: RegisterProps) {
  return (
    <AuthLayout>
      <SignUpWizard onAuthenticated={onAuthenticated} onNavigateLogin={onNavigateLogin} />
    </AuthLayout>
  )
}
