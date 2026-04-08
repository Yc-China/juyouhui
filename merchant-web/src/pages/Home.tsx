
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusCircle, CreditCard, History, Settings } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { useAuth } from '../context/AuthContext'
import { getDashboardStats } from '../utils/api'
import type { DashboardStats } from '../types/api'

const Home: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { merchant } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const res = await getDashboardStats()
      if (res.code === 0 && res.data) {
        setStats(res.data)
      }
    } catch (error) {
      console.error('加载统计数据失败', error)
    } finally {
      setLoading(false)
    }
  }

  const shortcuts = [
    {
      title: '发积分',
      icon: PlusCircle,
      color: 'bg-blue-50 text-blue-600',
      onClick: () => navigate('/send'),
    },
    {
      title: '充值',
      icon: CreditCard,
      color: 'bg-green-50 text-green-600',
      onClick: () => navigate('/recharge'),
    },
    {
      title: '积分流水',
      icon: History,
      color: 'bg-purple-50 text-purple-600',
      onClick: () => navigate('/history'),
    },
    {
      title: '店铺设置',
      icon: Settings,
      color: 'bg-orange-50 text-primary',
      onClick: () => navigate('/settings'),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6 pt-12 pb-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">
            {merchant?.name || '商家'}
          </h1>
          <p className="text-white/80">欢迎回来，聚优惠商家</p>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-3 gap-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/20 rounded-xl p-4 h-24"></div>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/20 backdrop-blur rounded-xl p-4">
              <p className="text-white/80 text-xs mb-1">当前余额</p>
              <p className="text-2xl font-bold">{stats.currentBalance}</p>
              <p className="text-white/80 text-xs">积分</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4">
              <p className="text-white/80 text-xs mb-1">累计发放</p>
              <p className="text-2xl font-bold">{stats.totalPointsSent}</p>
              <p className="text-white/80 text-xs">积分</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4">
              <p className="text-white/80 text-xs mb-1">今日发放</p>
              <p className="text-2xl font-bold">{stats.todayPointsSent}</p>
              <p className="text-white/80 text-xs">积分</p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Shortcuts */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 grid grid-cols-2 gap-4">
          {shortcuts.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="flex items-center p-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors border border-gray-100"
            >
              <div className={`p-3 rounded-lg mr-3 ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="font-medium text-gray-800">{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="px-4 mt-6">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <h3 className="font-medium text-secondary mb-2">💡 温馨提示</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 积分必须绑定消费金额发放，符合风控规则</li>
            <li>• 当前积分比例：消费 1 元赠 {merchant?.pointRatio || 0} 积分</li>
            <li>• 余额不足时请及时充值，避免影响发积分</li>
          </ul>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

export default Home
