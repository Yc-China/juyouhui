import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Loading from '../components/Loading'
import Pagination from '../components/Pagination'
import Modal from '../components/Modal'
import { getExchangeOrders, shipOrder, completeOrder } from '../api'
import type { ExchangeOrder } from '../types'
import { StatusMap } from '../types'

const ExchangeOrders: React.FC = () => {
  const [orders, setOrders] = useState<ExchangeOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<ExchangeOrder | null>(null)
  const [processing, setProcessing] = useState(false)

  const pageSize = 10

  const loadOrders = async () => {
    setLoading(true)
    try {
      const data = await getExchangeOrders({
        page,
        pageSize,
        ...(statusFilter && { status: statusFilter })
      }) as { orders: ExchangeOrder[], total: number }
      setOrders(data.orders)
      setTotal(data.total)
    } catch (err) {
      console.error('加载订单列表失败:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [page, statusFilter])

  const openDetail = (order: ExchangeOrder) => {
    setCurrentOrder(order)
    setDetailModalOpen(true)
  }

  const handleShip = async () => {
    if (!currentOrder) return
    if (!confirm('确认已发货？')) return
    setProcessing(true)
    try {
      await shipOrder(currentOrder.id)
      alert('已标记为已发货')
      setDetailModalOpen(false)
      loadOrders()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setProcessing(false)
    }
  }

  const handleComplete = async () => {
    if (!currentOrder) return
    if (!confirm('确认订单完成？')) return
    setProcessing(true)
    try {
      await completeOrder(currentOrder.id)
      alert('订单已完成')
      setDetailModalOpen(false)
      loadOrders()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const info = StatusMap[status as keyof typeof StatusMap]
    if (!info) return <span>{status}</span>
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${info.color}`}>
        {info.text}
      </span>
    )
  }

  if (loading) {
    return (
      <Layout title="兑换订单管理">
        <Loading />
      </Layout>
    )
  }

  return (
    <Layout title="兑换订单管理">
      <div className="mb-4 flex gap-4">
        <select
          className="form-input w-auto"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
        >
          <option value="">全部状态</option>
          <option value="PENDING">待发货</option>
          <option value="SHIPPED">已发货</option>
          <option value="COMPLETED">已完成</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-cell font-semibold text-gray-700 text-left">订单号</th>
                <th className="table-cell font-semibold text-gray-700 text-left">礼品</th>
                <th className="table-cell font-semibold text-gray-700 text-left">用户</th>
                <th className="table-cell font-semibold text-gray-700 text-left">收货人</th>
                <th className="table-cell font-semibold text-gray-700 text-left">状态</th>
                <th className="table-cell font-semibold text-gray-700 text-left">下单时间</th>
                <th className="table-cell font-semibold text-gray-700 text-left">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="table-cell font-medium text-gray-900">{order.orderNo}</td>
                  <td className="table-cell text-gray-600">{order.product?.name}</td>
                  <td className="table-cell text-gray-600">
                    {order.user?.nickname || order.user?.phone}
                  </td>
                  <td className="table-cell text-gray-600">{order.receiverName}</td>
                  <td className="table-cell">{getStatusBadge(order.status)}</td>
                  <td className="table-cell text-gray-600">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="table-cell">
                    <button
                      className="text-sm text-blue-600 hover:text-blue-800"
                      onClick={() => openDetail(order)}
                    >
                      详情
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="table-cell text-center text-gray-500">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          current={page}
          total={total}
          pageSize={pageSize}
          onChange={setPage}
        />
      </div>

      {/* 订单详情模态框 */}
      <Modal
        title="订单详情"
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        footer={
          currentOrder && (
            <>
              <button className="btn-outline" onClick={() => setDetailModalOpen(false)}>
                关闭
              </button>
              {currentOrder.status === 'PENDING' && (
                <button
                  className="btn-primary"
                  onClick={handleShip}
                  disabled={processing}
                >
                  {processing ? '处理中...' : '确认发货'}
                </button>
              )}
              {currentOrder.status === 'SHIPPED' && (
                <button
                  className="btn-secondary"
                  onClick={handleComplete}
                  disabled={processing}
                >
                  {processing ? '处理中...' : '确认完成'}
                </button>
              )}
            </>
          )
        }
      >
        {currentOrder && (
          <div className="space-y-4">
            <div>
              <label className="form-label">订单号</label>
              <p className="text-gray-800">{currentOrder.orderNo}</p>
            </div>
            <div>
              <label className="form-label">礼品信息</label>
              <p className="text-gray-800">
                {currentOrder.product.name} - {currentOrder.product.pricePoints} 积分
              </p>
            </div>
            <div>
              <label className="form-label">用户信息</label>
              <p className="text-gray-800">
                {currentOrder.user.nickname} ({currentOrder.user.phone})
              </p>
            </div>
            <div>
              <label className="form-label">收货人</label>
              <p className="text-gray-800">{currentOrder.receiverName}</p>
            </div>
            <div>
              <label className="form-label">收货人电话</label>
              <p className="text-gray-800">{currentOrder.receiverPhone}</p>
            </div>
            <div>
              <label className="form-label">收货地址</label>
              <p className="text-gray-800">{currentOrder.address}</p>
            </div>
            <div>
              <label className="form-label">订单状态</label>
              <p>{getStatusBadge(currentOrder.status)}</p>
            </div>
            {currentOrder.shippedAt && (
              <div>
                <label className="form-label">发货时间</label>
                <p className="text-gray-800">
                  {new Date(currentOrder.shippedAt).toLocaleString()}
                </p>
              </div>
            )}
            {currentOrder.completedAt && (
              <div>
                <label className="form-label">完成时间</label>
                <p className="text-gray-800">
                  {new Date(currentOrder.completedAt).toLocaleString()}
                </p>
              </div>
            )}
            <div>
              <label className="form-label">下单时间</label>
              <p className="text-gray-800">
                {new Date(currentOrder.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  )
}

export default ExchangeOrders
