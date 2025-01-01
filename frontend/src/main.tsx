import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import AuthProvider from './components/AuthProvider.tsx'
import SignUp from './pages/SignUpPage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import SignIn from './pages/SignInPage.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute> 
        <App />
      </ProtectedRoute>
    ),
    errorElement: <NotFoundPage />
  },
  {
    path: "/signin",
    element: <SignIn />
  },
  {
    path: "/signup",
    element: <SignUp />
  },
  {
    path: "/login",
    element: <SignIn />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <AuthProvider isSignedIn={!!localStorage.getItem('token')}> */}
    <AuthProvider isSignedIn={true}>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)