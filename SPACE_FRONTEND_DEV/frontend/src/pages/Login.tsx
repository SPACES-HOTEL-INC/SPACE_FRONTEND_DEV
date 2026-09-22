import AuthLayout from '../components/auth/AuthLayout'
import SignIn from '../components/auth/SignIn'
import type { Session } from '../types'

interface LoginProps {
  onAuthenticated: (session: Session) => void
  onNavigateSignup: () => void
  onNavigateForgotPassword: () => void
}

// Screen-level view: renders the split-screen auth shell + the SignIn card.
export default function Login({
  onAuthenticated,
  onNavigateSignup,
  onNavigateForgotPassword,
}: LoginProps) {
  return (
    <AuthLayout>
      <SignIn
        onAuthenticated={onAuthenticated}
        onNavigateSignup={onNavigateSignup}
        onNavigateForgotPassword={onNavigateForgotPassword}
      />
    </AuthLayout>
  )
}
