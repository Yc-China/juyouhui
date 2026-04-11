
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wallet, Shield, ArrowDown, ArrowUp } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { getBalanceInfo } from '../utils/api'
import type { BalanceInfo } from '../types/api'

const Balance: React.FC = () => {
  const [info, setInfo] = useState<BalanceInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const res = await getBalanceInfo()
      if (res.code === 0 && res.data) {
        setInfo(res.data)
      }
    } catch (error) {
      console.error('加载余额信息失败', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-500 mt-4">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-6 pt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">我的余额</h2>

        {info && (
          <>
            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-white mb-6 shadow-lg shadow-primary/30">
              <div className="flex items-center mb-4">
                <Wallet className="w-6 h-6 mr-2" />
                <span className="text-lg">当前积分余额</span>
              </div>
              <div className="text-4xl font-bold mb-4">{info.currentBalance}</div>
              <div className="flex space-x-6">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 opacity-80" />
                  <span>保证金：{info.deposit}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h3 className="font-medium text-gray-800 mb-4">统计信息</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                      <ArrowDown className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">累计充值</p>
                      <p className="font-medium text-gray-800">{info.totalRecharged} 积分</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                      <ArrowUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">累计发放</p>
                      <p className="font-medium text-gray-800">{info.totalPointsSent} 积分</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/recharge')}
                className="w-full py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 active:bg-primary/80 transition-all shadow-lg shadow-primary/30"
              >
                去充值
              </button>
              <button
                onClick={() => navigate('/history')}
                className="w-full py-4 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-all"
              >
                查看积分流水
              </button>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

export default Balance
