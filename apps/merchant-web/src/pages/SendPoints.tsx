
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, ShoppingCart, CheckCircle } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { useAuth } from '../context/AuthContext'
import { sendPoints } from '../utils/api'

const SendPoints: React.FC = () => {
  const [userPhone, setUserPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [result, setResult] = useState<{ points: number; newBalance: number } | null>(null)
  const [error, setError] = useState('')
  const { merchant } = useAuth()
  const navigate = useNavigate()

  const pointRatio = merchant?.pointRatio || 1
  const calculatedPoints = amount && !isNaN(Number(amount))
    ? Math.floor(Number(amount) * pointRatio)
    : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!userPhone || userPhone.length !== 11) {
      setError('请输入正确的手机号')
      return
    }

    if (!amount || Number(amount) <= 0) {
      setError('请输入大于0的消费金额')
      return
    }

    if (calculatedPoints <= 0) {
      setError('计算积分数必须大于0')
      return
    }

    if ((merchant?.balance || 0) < calculatedPoints) {
      setError(`积分余额不足，当前余额 ${merchant?.balance}，需要 ${calculatedPoints} 积分，请先充值`)
      return
    }

    setLoading(true)

    try {
      const res = await sendPoints({
        userPhone,
        amount: Number(amount),
      })

      if (res.code === 0 && res.data) {
        setSuccess(true)
        setResult(res.data)
      } else {
        setError(res.message || '发放失败，请重试')
      }
    } catch (err) {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setUserPhone('')
    setAmount('')
    setSuccess(false)
    setResult(null)
    setError('')
  }

  if (success && result) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="p-6 pt-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">发放成功</h2>
          <p className="text-gray-500 mb-8">积分已成功发放给用户</p>

          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 text-left">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">用户手机号</span>
                <span className="font-medium text-gray-800">{userPhone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">消费金额</span>
                <span className="font-medium text-gray-800">¥{Number(amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">积分比例</span>
                <span className="font-medium text-gray-800">1元 = {pointRatio}积分</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                <span className="text-lg font-medium text-gray-800">发放积分数</span>
                <span className="text-xl font-bold text-primary">{result.points}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">剩余积分余额</span>
                <span className="font-medium text-gray-800">{result.newBalance}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleReset}
              className="w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 active:bg-primary/80 transition-all"
            >
              继续发放
            </button>
            <button
              onClick={() => navigate('/history')}
              className="w-full py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-all"
            >
              查看发放记录
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-6 pt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">给用户发积分</h2>
        <p className="text-gray-500 mb-6">根据用户消费金额自动计算积分数</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline-block w-4 h-4 mr-1 mb-1" />
              用户手机号
            </label>
            <input
              type="tel"
              placeholder="请输入用户的11位手机号"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value.replace(/\D/g, ''))}
              maxLength={11}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              required
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ShoppingCart className="inline-block w-4 h-4 mr-1 mb-1" />
              用户消费金额（元）
            </label>
            <input
              type="number"
              placeholder="请输入消费金额"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              required
            />
          </div>

          {/* Calculation Preview */}
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
            <h3 className="font-medium text-primary mb-3">积分计算</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">积分比例</span>
                <span className="text-gray-800">消费 1 元 赠送 {pointRatio} 积分</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">消费金额</span>
                <span className="text-gray-800">
                  {amount ? `¥${Number(amount).toFixed(2)}` : '-'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-primary/20">
                <span className="font-medium text-gray-800">将发放积分</span>
                <span className="text-xl font-bold text-primary">{calculatedPoints}</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              💡 积分数 = 消费金额 × 积分比例（向下取整）
            </div>
          </div>

          <div className="fixed bottom-24 left-4 right-4">
            <button
              type="submit"
              disabled={loading || calculatedPoints <= 0}
              className="w-full py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 active:bg-primary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30"
            >
              {loading ? '发放中...' : `确认发放 ${calculatedPoints} 积分`}
            </button>
          </div>
        </form>
      </div>

      <BottomNav />
    </div>
  )
}

export default SendPoints
