
import React, { useState } from 'react'
import BottomNav from '../components/BottomNav'
import { createRechargeOrder, getRechargeOrders } from '../utils/api'
import type { RechargeOrder } from '../types/api'
import { QrCode, CreditCard, List } from 'lucide-react'
import { useEffect } from 'react'

const quickAmounts = [100, 500, 1000, 2000]

const Recharge: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderInfo, setOrderInfo] = useState<{
    orderNo: string
    amount: number
    points: number
    qrcodeUrl: string
  } | null>(null)
  const [orders, setOrders] = useState<RechargeOrder[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return <span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs">待支付</span>
      case 1:
        return <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs">已支付</span>
      case 2:
        return <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs">已取消</span>
      default:
        return <span className="text-gray-500">未知</span>
    }
  }

  const loadOrders = async () => {
    setOrdersLoading(true)
    try {
      const res = await getRechargeOrders(1, 30)
      if (res.code === 0 && res.data) {
        setOrders(res.data.records || [])
      }
    } catch (error) {
      console.error('加载充值记录失败', error)
    } finally {
      setOrdersLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'list') {
      loadOrders()
    }
  }, [activeTab])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const numAmount = Number(amount)
    if (!amount || numAmount <= 0) {
      setError('请输入大于0的充值金额')
      return
    }

    setLoading(true)

    try {
      const res = await createRechargeOrder({ amount: numAmount })
      if (res.code === 0 && res.data) {
        setOrderInfo({
          orderNo: res.data.orderNo,
          amount: res.data.amount,
          points: res.data.points,
          qrcodeUrl: res.data.qrcodeUrl,
        })
      } else {
        setError(res.message || '创建订单失败，请重试')
      }
    } catch (err) {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAmount = (value: number) => {
    setAmount(String(value))
  }

  const handleBack = () => {
    setOrderInfo(null)
    setAmount('')
    setError('')
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-6 pt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">积分充值</h2>

        <div className="flex mb-6 bg-white rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium ${
              activeTab === 'create'
                ? 'bg-primary text-white'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center">
              <QrCode className="w-4 h-4 mr-2" />
              新建充值
            </div>
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium ${
              activeTab === 'list'
                ? 'bg-primary text-white'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center">
              <List className="w-4 h-4 mr-2" />
              充值记录
            </div>
          </button>
        </div>

        {activeTab === 'create' && (
          <>
            {orderInfo ? (
              <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
                <h3 className="text-xl font-bold mb-4">请扫码支付</h3>
                <div className="inline-block bg-white p-4 border rounded-xl mb-4">
                  <img
                    src={orderInfo.qrcodeUrl}
                    alt="支付二维码"
                    className="w-64 h-64"
                  />
                </div>
                <div className="space-y-2 text-left mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-500">订单号</span>
                    <span className="font-mono text-sm">{orderInfo.orderNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">充值金额</span>
                    <span className="font-medium">¥{orderInfo.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">将获得积分</span>
                    <span className="font-bold text-primary">{orderInfo.points}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  请使用微信或支付宝扫码支付，支付完成后积分将自动到账
                </p>
                <button
                  onClick={handleBack}
                  className="w-full py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  返回新建充值
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <div className="bg-white rounded-xl shadow-sm p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    充值金额（元）
                  </label>
                  <input
                    type="number"
                    placeholder="请输入充值金额"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    step="1"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    required
                  />

                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {quickAmounts.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => handleQuickAmount(v)}
                        className={`py-2 rounded-lg border text-sm font-medium ${
                          Number(amount) === v
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-gray-200 text-gray-700 hover:border-primary/50'
                        }`}
                      >
                        {v}元
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                  <h3 className="font-medium text-primary mb-3">充值说明</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 1元充值可获得1积分</li>
                    <li>• 充值金额必须大于0元</li>
                    <li>• 支付成功后积分会自动充值到您的账户</li>
                    <li>• 充值积分只用于给用户发放，不可提现</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 active:bg-primary/80 transition-all disabled:opacity-50 shadow-lg shadow-primary/30"
                  >
                    {loading ? '创建订单中...' : '创建充值订单'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {activeTab === 'list' && (
          <div className="space-y-3">
            {ordersLoading && orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-gray-500 mt-4">加载中...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">暂无充值记录</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-mono text-sm text-gray-500">
                        {order.orderNo}
                      </div>
                    </div>
                    {getStatusText(order.status)}
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">充值金额</span>
                    <span className="font-medium">¥{order.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">获得积分</span>
                    <span className="font-bold text-primary">{order.points}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(order.createdAt).toLocaleString('zh-CN')}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

export default Recharge
