
import React, { useState, useEffect } from 'react'
import BottomNav from '../components/BottomNav'
import { getPointTransactions } from '../utils/api'
import type { PointTransaction } from '../types/api'
import { Calendar, User } from 'lucide-react'

const PointHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<PointTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const loadData = async (currentPage: number) => {
    try {
      const res = await getPointTransactions(currentPage, 20)
      if (res.code === 0 && res.data) {
        const list = res.data.records || []
        if (currentPage === 1) {
          setTransactions(list)
        } else {
          setTransactions([...transactions, ...list])
        }
        setHasMore(list.length >= res.data.pageSize)
        setPage(res.data.page)
      }
    } catch (error) {
      console.error('加载积分流水失败', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData(1)
  }, [])

  const loadMore = () => {
    if (!loading && hasMore) {
      loadData(page + 1)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-6 pt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">积分流水</h2>

        {loading && transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-500 mt-4">加载中...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">暂无发放记录</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-800 font-medium">{item.userPhone}</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">+{item.points}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(item.createdAt)}
                  </div>
                  <div>消费金额：¥{item.amount.toFixed(2)}</div>
                </div>
              </div>
            ))}

            {hasMore && (
              <div className="text-center py-4">
                <button
                  onClick={loadMore}
                  className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  {loading ? '加载中...' : '加载更多'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

export default PointHistory
