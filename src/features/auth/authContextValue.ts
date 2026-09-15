import { createContext } from 'react'
import type { AuthCredentials, RegisterInput, User } from '../../types'

export type AuthContextValue = {
    user: User | null
    loading: boolean
    error: string | null
    login: (input: AuthCredentials) => Promise<User>
    register: (input: RegisterInput) => Promise<User>
    logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
