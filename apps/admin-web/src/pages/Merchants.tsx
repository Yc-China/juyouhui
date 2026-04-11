import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Loading from '../components/Loading'
import Pagination from '../components/Pagination'
import Modal from '../components/Modal'
import { getMerchants, updateMerchantStatus } from '../api'
import type { Merchant } from '../types'
import { StatusMap } from '../types'

const Merchants: React.FC = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [keyword, setKeyword] = useState('')
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [currentMerchant, setCurrentMerchant] = useState<Merchant | null>(null)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<'APPROVED' | 'DISABLED'>('APPROVED')
  const [processing, setProcessing] = useState(false)

  const pageSize = 10

  const loadMerchants = async () => {
    setLoading(true)
    try {
      const data = await getMerchants({
        page,
        pageSize,
        ...(statusFilter && { status: statusFilter }),
        ...(keyword && { keyword })
      }) as { merchants: Merchant[], total: number }
      setMerchants(data.merchants)
      setTotal(data.total)
    } catch (err) {
      console.error('加载商家列表失败:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMerchants()
  }, [page, statusFilter])

  const handleSearch = () => {
    setPage(1)
    loadMerchants()
  }

  const openDetail = (merchant: Merchant) => {
    setCurrentMerchant(merchant)
    setDetailModalOpen(true)
  }

  const openChangeStatus = (merchant: Merchant) => {
    setCurrentMerchant(merchant)
    setNewStatus(merchant.status === 'APPROVED' ? 'DISABLED' : 'APPROVED')
    setStatusModalOpen(true)
  }

  const handleChangeStatus = async () => {
    if (!currentMerchant) return
    setProcessing(true)
    try {
      await updateMerchantStatus(currentMerchant.id, newStatus)
      const statusText = newStatus === 'APPROVED' ? '启用' : '禁用'
      alert(`${statusText}成功`)
      setStatusModalOpen(false)
      loadMerchants()
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
      <Layout title="商家管理">
        <Loading />
      </Layout>
    )
  }

  return (
    <Layout title="商家管理">
      <div className="mb-4 flex gap-4 flex-wrap">
        <input
          type="text"
          className="form-input w-auto"
          placeholder="搜索商家名称/电话"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <select
          className="form-input w-auto"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
        >
          <option value="">全部状态</option>
          <option value="APPROVED">已启用</option>
          <option value="DISABLED">已禁用</option>
        </select>
        <button className="btn-primary" onClick={handleSearch}>
          搜索
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-cell font-semibold text-gray-700 text-left">商家名称</th>
                <th className="table-cell font-semibold text-gray-700 text-left">联系人</th>
                <th className="table-cell font-semibold text-gray-700 text-left">联系电话</th>
                <th className="table-cell font-semibold text-gray-700 text-left">保证金</th>
                <th className="table-cell font-semibold text-gray-700 text-left">当前积分</th>
                <th className="table-cell font-semibold text-gray-700 text-left">状态</th>
                <th className="table-cell font-semibold text-gray-700 text-left">入驻时间</th>
                <th className="table-cell font-semibold text-gray-700 text-left">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {merchants.map((merchant) => (
                <tr key={merchant.id}>
                  <td className="table-cell font-medium text-gray-900">{merchant.name}</td>
                  <td className="table-cell text-gray-600">{merchant.contactName}</td>
                  <td className="table-cell text-gray-600">{merchant.contactPhone}</td>
                  <td className="table-cell text-gray-600">{(merchant.deposit / 100).toFixed(2)}元</td>
                  <td className="table-cell text-gray-600">{merchant.balancePoints}</td>
                  <td className="table-cell">{getStatusBadge(merchant.status)}</td>
                  <td className="table-cell text-gray-600">
                    {new Date(merchant.createdAt).toLocaleString()}
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button
                        className="text-sm text-blue-600 hover:text-blue-800"
                        onClick={() => openDetail(merchant)}
                      >
                        详情
                      </button>
                      <button
                        className={`text-sm ${
                          merchant.status === 'APPROVED'
                            ? 'text-red-600 hover:text-red-800'
                            : 'text-green-600 hover:text-green-800'
                        }`}
                        onClick={() => openChangeStatus(merchant)}
                      >
                        {merchant.status === 'APPROVED' ? '禁用' : '启用'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {merchants.length === 0 && (
                <tr>
                  <td colSpan={8} className="table-cell text-center text-gray-500">
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

      {/* 详情模态框 */}
      <Modal
        title="商家详情"
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
      >
        {currentMerchant && (
          <div className="space-y-4">
            <div>
              <label className="form-label">商家名称</label>
              <p className="text-gray-800">{currentMerchant.name}</p>
            </div>
            <div>
              <label className="form-label">联系人</label>
              <p className="text-gray-800">{currentMerchant.contactName}</p>
            </div>
            <div>
              <label className="form-label">联系电话</label>
              <p className="text-gray-800">{currentMerchant.contactPhone}</p>
            </div>
            <div>
              <label className="form-label">地址</label>
              <p className="text-gray-800">{currentMerchant.address}</p>
            </div>
            <div>
              <label className="form-label">营业执照</label>
              <p className="text-gray-800 break-all">{currentMerchant.businessLicense}</p>
            </div>
            <div>
              <label className="form-label">保证金</label>
              <p className="text-gray-800">{(currentMerchant.deposit / 100).toFixed(2)}元</p>
            </div>
            <div>
              <label className="form-label">当前账户积分</label>
              <p className="text-gray-800">{currentMerchant.balancePoints}</p>
            </div>
            <div>
              <label className="form-label">返点比例</label>
              <p className="text-gray-800">{currentMerchant.pointRule}%</p>
            </div>
            <div>
              <label className="form-label">状态</label>
              <p>{getStatusBadge(currentMerchant.status)}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* 确认状态改变模态框 */}
      <Modal
        title="确认操作"
        open={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        footer={
          <>
            <button className="btn-outline" onClick={() => setStatusModalOpen(false)}>
              取消
            </button>
            <button
              className={`${
                newStatus === 'DISABLED' ? 'bg-red-600 hover:bg-red-700' : 'btn-primary'
              } text-white px-4 py-2 rounded-lg`}
              onClick={handleChangeStatus}
              disabled={processing}
            >
              {processing ? '处理中...' : `确认${newStatus === 'APPROVED' ? '启用' : '禁用'}`}
            </button>
          </>
        }
      >
        {currentMerchant && (
          <p className="text-gray-600">
            确认{newStatus === 'APPROVED' ? '启用' : '禁用'}商家「{currentMerchant.name}」？
          </p>
        )}
      </Modal>
    </Layout>
  )
}

export default Merchants
