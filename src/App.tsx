import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { SignupPage } from '@/pages/auth/SignupPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ReviewsPage } from '@/pages/ReviewsPage'
import { SocialListeningPage } from '@/pages/SocialListeningPage'
import { ProductsPage } from '@/pages/ProductsPage'
import { InfluencersPage } from '@/pages/InfluencersPage'
import { CompetitorPage } from '@/pages/CompetitorPage'
import { AIRecommendationsPage } from '@/pages/AIRecommendationsPage'
import { ReportsPage } from '@/pages/ReportsPage'
import { NotificationsPage } from '@/pages/NotificationsPage'
import { SettingsPage } from '@/pages/SettingsPage'

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
      </Route>
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="social" element={<SocialListeningPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="influencers" element={<InfluencersPage />} />
        <Route path="competitors" element={<CompetitorPage />} />
        <Route path="ai-recommendations" element={<AIRecommendationsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
    </Routes>
  )
}

export default App
