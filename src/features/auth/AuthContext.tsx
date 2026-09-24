import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { api, clearStoredToken, getStoredToken, setStoredToken } from '../../services/api'
import type { AuthCredentials, RegisterInput, User } from '../../types'
import { getErrorMessage } from '../../utils/errors'
import { AuthContext } from './authContextValue'

const guestCartId = () => localStorage.getItem('nexora_cart_id') || undefined

export function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(() => Boolean(getStoredToken()))
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!getStoredToken()) {
            return
        }

        api.getCurrentUser()
            .then(({ user: currentUser }) => setUser(currentUser))
            .catch(() => {
                clearStoredToken()
                setUser(null)
            })
            .finally(() => setLoading(false))
    }, [])

    const login = useCallback(async (input: AuthCredentials) => {
        try {
            setError(null)
            const result = await api.login(input, guestCartId())
            setStoredToken(result.token)
            localStorage.removeItem('nexora_cart_id')
            setUser(result.user)
            return result.user
        } catch (loginError) {
            const message = getErrorMessage(loginError, 'Unable to log in')
            setError(message)
            throw new Error(message)
        }
    }, [])

    const register = useCallback(async (input: RegisterInput) => {
        try {
            setError(null)
            const result = await api.register(input, guestCartId())
            setStoredToken(result.token)
            localStorage.removeItem('nexora_cart_id')
            setUser(result.user)
            return result.user
        } catch (registerError) {
            const message = getErrorMessage(registerError, 'Unable to create account')
            setError(message)
            throw new Error(message)
        }
    }, [])

    const logout = useCallback(() => {
        clearStoredToken()
        localStorage.removeItem('nexora_cart_id')
        setUser(null)
        setError(null)
    }, [])

    const value = useMemo(() => ({ user, loading, error, login, register, logout }), [
        user, loading, error, login, register, logout,
    ])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
