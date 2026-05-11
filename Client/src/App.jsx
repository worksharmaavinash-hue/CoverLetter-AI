import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import AuthPage from './features/auth/pages/AuthPage'
import GenerateCV from './features/generateCv/pages/GenerateCV'
import LandingPage from './features/landing/pages/LandingPage'

function ProtectedRoute({ children }) {
    const savedUser = localStorage.getItem('cvMakerUser')

    return savedUser ? children : <Navigate to="/login" replace />
}

function GuestRoute({ children }) {
    const savedUser = localStorage.getItem('cvMakerUser')

    return savedUser ? <Navigate to="/generate" replace /> : children
}

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                    path="/login"
                    element={
                        <GuestRoute>
                            <AuthPage initialMode="login" />
                        </GuestRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <GuestRoute>
                            <AuthPage initialMode="register" />
                        </GuestRoute>
                    }
                />
                <Route
                    path="/generate"
                    element={
                        <ProtectedRoute>
                            <GenerateCV />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/generate" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App  
