
import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  login as apiLogin,
  logout as apiLogout,
  getMerchantInfo,
  setToken,
  removeToken,
  isAuthenticated,
} from '../utils/api'
import type { MerchantInfo } from '../types/api'

interface AuthContextType {
  isAuthenticated: boolean
  merchant: MerchantInfo | null
  loading: boolean
  login: (phone: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => Promise<void>
  refreshMerchantInfo: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(() => isAuthenticated())
  const [merchant, setMerchant] = useState<MerchantInfo | null>(null)
  const [loading, setLoading] = useState(true)

  // 初始化时加载商家信息
  useEffect(() => {
    if (authenticated) {
      refreshMerchantInfo().finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [authenticated])

  const login = async (phone: string, password: string) => {
    try {
      const res = await apiLogin({ phone, password })
      if (res.code === 0 && res.data) {
        setToken(res.data.token)
        setAuthenticated(true)
        setMerchant(res.data.merchant)
        return { success: true, message: '登录成功' }
      }
      return { success: false, message: res.message || '登录失败' }
    } catch (error) {
      return { success: false, message: '网络错误，请重试' }
    }
  }

  const logout = async () => {
    try {
      await apiLogout()
    } finally {
      removeToken()
      setAuthenticated(false)
      setMerchant(null)
    }
  }

  const refreshMerchantInfo = async () => {
    try {
      const res = await getMerchantInfo()
      if (res.code === 0 && res.data) {
        setMerchant(res.data)
      }
    } catch (error) {
      console.error('获取商家信息失败', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authenticated,
        merchant,
        loading,
        login,
        logout,
        refreshMerchantInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
