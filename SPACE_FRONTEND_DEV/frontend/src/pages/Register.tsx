import AuthLayout from '../components/auth/AuthLayout'
import SignUpWizard from '../components/auth/SignUpWizard'
import type { Session } from '../types'

interface RegisterProps {
  onAuthenticated: (session: Session) => void
  onNavigateLogin: () => void
  onNavigateOtp: (email: string) => void
}

// Screen-level view: renders the split-screen auth shell + the signup wizard.
export default function Register({
  onAuthenticated,
  onNavigateLogin,
  onNavigateOtp,
}: RegisterProps) {
  return (
    <AuthLayout>
      <SignUpWizard
        onAuthenticated={onAuthenticated}
        onNavigateLogin={onNavigateLogin}
        onNavigateOtp={onNavigateOtp}
      />
    </AuthLayout>
  )
}