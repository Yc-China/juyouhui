
import React, { useState } from 'react'
import BottomNav from '../components/BottomNav'
import { useAuth } from '../context/AuthContext'
import { updatePointRatio, changePassword, logout } from '../utils/api'
import { Store, Key, Settings as SettingsIcon, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Settings: React.FC = () => {
  const { merchant, refreshMerchantInfo, logout: authLogout } = useAuth()
  const navigate = useNavigate()
  const [pointRatio, setPointRatio] = useState(String(merchant?.pointRatio || 1))
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [ratioLoading, setRatioLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [ratioMessage, setRatioMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleUpdateRatio = async (e: React.FormEvent) => {
    e.preventDefault()
    setRatioMessage(null)
    const ratio = Number(pointRatio)

    if (isNaN(ratio) || ratio <= 0) {
      setRatioMessage({ type: 'error', text: '请输入大于0的积分比例' })
      return
    }

    setRatioLoading(true)
    try {
      const res = await updatePointRatio({ pointRatio: ratio })
      if (res.code === 0) {
        setRatioMessage({ type: 'success', text: '积分比例更新成功' })
        await refreshMerchantInfo()
      } else {
        setRatioMessage({ type: 'error', text: res.message || '更新失败' })
      }
    } catch (error) {
      setRatioMessage({ type: 'error', text: '网络错误，请重试' })
    } finally {
      setRatioLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMessage(null)

    if (!oldPassword) {
      setPasswordMessage({ type: 'error', text: '请输入旧密码' })
      return
    }

    if (!newPassword || newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: '新密码至少6位' })
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: '两次密码输入不一致' })
      return
    }

    setPasswordLoading(true)
    try {
      const res = await changePassword({ oldPassword, newPassword })
      if (res.code === 0) {
        setPasswordMessage({ type: 'success', text: '密码修改成功，请重新登录' })
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
        // 自动退出登录
        setTimeout(() => handleLogout(), 1500)
      } else {
        setPasswordMessage({ type: 'error', text: res.message || '修改失败' })
      }
    } catch (error) {
      setPasswordMessage({ type: 'error', text: '网络错误，请重试' })
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleLogout = async () => {
    if (!window.confirm('确定要退出登录吗？')) {
      return
    }
    await logout()
    authLogout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-6 pt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">商家设置</h2>

        {/* Store Info */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center mb-4">
            <Store className="w-5 h-5 text-primary mr-2" />
            <h3 className="font-medium text-gray-800">店铺信息</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">店铺名称</span>
              <span className="font-medium text-gray-800">{merchant?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">手机号</span>
              <span className="font-medium text-gray-800">{merchant?.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">保证金</span>
              <span className="font-medium text-gray-800">{merchant?.deposit} 积分</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">当前积分比例</span>
              <span className="font-medium text-primary">1元 = {merchant?.pointRatio} 积分</span>
            </div>
          </div>
        </div>

        {/* Point Ratio Settings */}
        <form onSubmit={handleUpdateRatio} className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center mb-4">
            <SettingsIcon className="w-5 h-5 text-primary mr-2" />
            <h3 className="font-medium text-gray-800">积分比例设置</h3>
          </div>

          {ratioMessage && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                ratioMessage.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-600'
                  : 'bg-red-50 border border-red-200 text-red-600'
              }`}
            >
              {ratioMessage.text}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              消费 1 元赠送积分数
            </label>
            <input
              type="number"
              value={pointRatio}
              onChange={(e) => setPointRatio(e.target.value)}
              step="0.1"
              min="0.1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              placeholder="例如：1"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              设置为1表示用户消费1元赠送1积分，设置为0.5表示消费1元赠送0.5积分
            </p>
          </div>

          <button
            type="submit"
            disabled={ratioLoading}
            className="w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 active:bg-primary/80 transition-all disabled:opacity-50"
          >
            {ratioLoading ? '保存中...' : '保存设置'}
          </button>
        </form>

        {/* Change Password */}
        <form onSubmit={handleChangePassword} className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center mb-4">
            <Key className="w-5 h-5 text-primary mr-2" />
            <h3 className="font-medium text-gray-800">修改密码</h3>
          </div>

          {passwordMessage && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                passwordMessage.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-600'
                  : 'bg-red-50 border border-red-200 text-red-600'
              }`}
            >
              {passwordMessage.text}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                旧密码
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="请输入旧密码"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                新密码
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="请输入新密码（至少6位）"
                minLength={6}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                确认新密码
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="再次输入新密码"
                minLength={6}
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full py-3 bg-secondary text-white font-medium rounded-xl hover:bg-secondary/90 active:bg-secondary/80 transition-all disabled:opacity-50"
            >
              {passwordLoading ? '修改中...' : '修改密码'}
            </button>
          </div>
        </form>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-4 bg-white border border-red-200 text-red-600 font-medium rounded-xl hover:bg-red-50 active:bg-red-100 transition-all flex items-center justify-center"
        >
          <LogOut className="w-5 h-5 mr-2" />
          退出登录
        </button>
      </div>

      <BottomNav />
    </div>
  )
}

export default Settings
