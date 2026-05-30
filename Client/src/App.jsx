import { createBrowserRouter, RouterProvider, Navigate } from 'react-router'
import GenerateCV from './features/generateCv/pages/GenerateCV'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {

    const router = createBrowserRouter([
        {
            path: '/',
            element: <Navigate to="/login" replace />
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
        },
        {
            path: '*',
            element: <Navigate to="/login" replace />
        }
    ])

    return (
        <RouterProvider router={router} />
    )
}

export default App