import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Loading from '../components/Loading'
import Pagination from '../components/Pagination'
import Modal from '../components/Modal'
import { getApplications, approveApplication, rejectApplication } from '../api'
import type { MerchantApplication } from '../types'
import { StatusMap } from '../types'

const Applications: React.FC = () => {
  const [applications, setApplications] = useState<MerchantApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [openDetailModal, setOpenDetailModal] = useState(false)
  const [currentApplication, setCurrentApplication] = useState<MerchantApplication | null>(null)
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [rejectRemark, setRejectRemark] = useState('')
  const [processing, setProcessing] = useState(false)

  const pageSize = 10

  const loadApplications = async () => {
    setLoading(true)
    try {
      const data = await getApplications({
        page,
        pageSize,
        ...(statusFilter && { status: statusFilter })
      }) as { applications: MerchantApplication[], total: number }
      setApplications(data.applications)
      setTotal(data.total)
    } catch (err) {
      console.error('加载申请列表失败:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApplications()
  }, [page, statusFilter])

  const openDetail = (app: MerchantApplication) => {
    setCurrentApplication(app)
    setOpenDetailModal(true)
  }

  const openApprove = (app: MerchantApplication) => {
    setCurrentApplication(app)
    setPassword('')
    setApproveModalOpen(true)
  }

  const openReject = (app: MerchantApplication) => {
    setCurrentApplication(app)
    setRejectRemark('')
    setRejectModalOpen(true)
  }

  const handleApprove = async () => {
    if (!currentApplication || !password) return
    setProcessing(true)
    try {
      await approveApplication(currentApplication.id, password)
      alert('审核通过成功')
      setApproveModalOpen(false)
      loadApplications()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!currentApplication) return
    setProcessing(true)
    try {
      await rejectApplication(currentApplication.id, rejectRemark)
      alert('已拒绝申请')
      setRejectModalOpen(false)
      loadApplications()
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
      <Layout title="商家入驻审核">
        <Loading />
      </Layout>
    )
  }

  return (
    <Layout title="商家入驻审核">
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
          <option value="PENDING">待审核</option>
          <option value="APPROVED">已通过</option>
          <option value="REJECTED">已拒绝</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-cell font-semibold text-gray-700 text-left">商家名称</th>
                <th className="table-cell font-semibold text-gray-700 text-left">联系人</th>
                <th className="table-cell font-semibold text-gray-700 text-left">联系电话</th>
                <th className="table-cell font-semibold text-gray-700 text-left">状态</th>
                <th className="table-cell font-semibold text-gray-700 text-left">申请时间</th>
                <th className="table-cell font-semibold text-gray-700 text-left">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.id}>
                  <td className="table-cell font-medium text-gray-900">{app.name}</td>
                  <td className="table-cell text-gray-600">{app.contactName}</td>
                  <td className="table-cell text-gray-600">{app.contactPhone}</td>
                  <td className="table-cell">{getStatusBadge(app.status)}</td>
                  <td className="table-cell text-gray-600">
                    {new Date(app.createdAt).toLocaleString()}
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button
                        className="text-sm text-blue-600 hover:text-blue-800"
                        onClick={() => openDetail(app)}
                      >
                        查看
                      </button>
                      {app.status === 'PENDING' && (
                        <>
                          <button
                            className="text-sm text-green-600 hover:text-green-800"
                            onClick={() => openApprove(app)}
                          >
                            通过
                          </button>
                          <button
                            className="text-sm text-red-600 hover:text-red-800"
                            onClick={() => openReject(app)}
                          >
                            拒绝
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan={6} className="table-cell text-center text-gray-500">
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
        title="申请详情"
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
      >
        {currentApplication && (
          <div className="space-y-4">
            <div>
              <label className="form-label">商家名称</label>
              <p className="text-gray-800">{currentApplication.name}</p>
            </div>
            <div>
              <label className="form-label">联系人</label>
              <p className="text-gray-800">{currentApplication.contactName}</p>
            </div>
            <div>
              <label className="form-label">联系电话</label>
              <p className="text-gray-800">{currentApplication.contactPhone}</p>
            </div>
            <div>
              <label className="form-label">地址</label>
              <p className="text-gray-800">{currentApplication.address}</p>
            </div>
            <div>
              <label className="form-label">营业执照</label>
              <p className="text-gray-800 break-all">{currentApplication.businessLicense}</p>
            </div>
            <div>
              <label className="form-label">状态</label>
              <p>{getStatusBadge(currentApplication.status)}</p>
            </div>
            {currentApplication.remark && (
              <div>
                <label className="form-label">拒绝原因</label>
                <p className="text-gray-800">{currentApplication.remark}</p>
              </div>
            )}
            <div>
              <label className="form-label">申请时间</label>
              <p className="text-gray-800">
                {new Date(currentApplication.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* 通过审核模态框 */}
      <Modal
        title="审核通过"
        open={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        footer={
          <>
            <button className="btn-outline" onClick={() => setApproveModalOpen(false)}>
              取消
            </button>
            <button
              className="btn-primary"
              onClick={handleApprove}
              disabled={processing}
            >
              {processing ? '处理中...' : '确认通过'}
            </button>
          </>
        }
      >
        {currentApplication && (
          <div>
            <p className="mb-4 text-gray-600">
              确认通过商家「{currentApplication.name}」的入驻申请？请设置商家登录密码。
            </p>
            <div>
              <label className="form-label">商家登录密码</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入初始密码"
                required
              />
            </div>
          </div>
        )}
      </Modal>

      {/* 拒绝申请模态框 */}
      <Modal
        title="拒绝申请"
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        footer={
          <>
            <button className="btn-outline" onClick={() => setRejectModalOpen(false)}>
              取消
            </button>
            <button
              className="btn-primary bg-red-600 hover:bg-red-700"
              onClick={handleReject}
              disabled={processing}
            >
              {processing ? '处理中...' : '确认拒绝'}
            </button>
          </>
        }
      >
        {currentApplication && (
          <div>
            <p className="mb-4 text-gray-600">
              确认拒绝商家「{currentApplication.name}」的入驻申请？
            </p>
            <div>
              <label className="form-label">拒绝原因</label>
              <textarea
                className="form-input h-24"
                value={rejectRemark}
                onChange={(e) => setRejectRemark(e.target.value)}
                placeholder="请输入拒绝原因"
              ></textarea>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  )
}

export default Applications
