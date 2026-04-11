import React, { createContext, useContext, useState } from 'react'
import type { Admin } from '../types'

interface AuthContextType {
  admin: Admin | null
  token: string | null
  login: (token: string, admin: Admin) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

// 从localStorage读取
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to parse', key, e)
  }
  return defaultValue
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 直接初始化读取，不等待useEffect，避免刷新后状态为空
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('admin_token')
  )
  const [admin, setAdmin] = useState<Admin | null>(
    () => loadFromStorage<Admin | null>('admin_info', null)
  )

  const login = (newToken: string, newAdmin: Admin) => {
    localStorage.setItem('admin_token', newToken)
    localStorage.setItem('admin_info', JSON.stringify(newAdmin))
    setToken(newToken)
    setAdmin(newAdmin)
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_info')
    setToken(null)
    setAdmin(null)
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
