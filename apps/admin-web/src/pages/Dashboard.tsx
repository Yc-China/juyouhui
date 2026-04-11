import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Loading from '../components/Loading'
import { getStats } from '../api'
import type { Stats } from '../types'

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await getStats()
      setStats(data)
    } catch (err) {
      console.error('加载统计数据失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: '总用户数', value: stats?.totalUsers || 0 },
    { label: '总商家数', value: stats?.totalMerchants || 0 },
    { label: '已通过商家', value: stats?.approvedMerchants || 0 },
    { label: '待审核申请', value: stats?.pendingApplications || 0 },
    { label: '已上架礼品', value: stats?.totalProducts || 0 },
    { label: '待发货订单', value: stats?.pendingExchangeOrders || 0 },
    { label: '累计发放积分', value: stats?.totalPointsIssued || 0 },
    { label: '累计兑换积分', value: stats?.totalPointsExchanged || 0 },
  ]

  if (loading) {
    return (
      <Layout title="数据统计">
        <Loading />
      </Layout>
    )
  }

  return (
    <Layout title="数据统计">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div key={index} className="card p-6">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {typeof card.value === 'number' && card.value > 1000 
                ? card.value.toLocaleString() 
                : card.value}
            </p>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export default Dashboard
