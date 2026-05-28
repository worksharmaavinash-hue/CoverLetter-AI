import { createBrowserRouter, RouterProvider } from 'react-router'
import LandingPage from './features/landing/pages/LandingPage'
import GenerateCV from './features/generateCv/pages/GenerateCV'
import AppLayout from './components/AppLayout'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {

    const router = createBrowserRouter([
        {
            path: '/',
            element: <AppLayout />,
            children: [
                {
                    index: true,
                    element: <LandingPage />
                },
                {
                    path: '/login',
                    element: <Login />
                },
                {
                    path: '/register',
                    element: <Register />
                },
                {
                    path: '/generate',
                    element: <ProtectedRoute><GenerateCV /></ProtectedRoute>
                }
            ]
        }
    ])


  return (
    <RouterProvider router={router} />
  )
}

export default App
