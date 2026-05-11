import axios from 'axios'

const api = axios.create({
    baseURL: 'https://coverletter-ai-vjuw.onrender.com' || 'http://localhost:8000',
    withCredentials: true
})

export async function loginUser({ email, password }) {
    const res = await api.post('/api/auth/login', {
        email,
        password
    })

    return res.data
}

export async function registerUser({ username, email, password }) {
    const res = await api.post('/api/auth/register', {
        username,
        email,
        password
    })

    return res.data
}

export async function logoutUser() {
    const res = await api.post('/api/auth/logout')

    return res.data
}
