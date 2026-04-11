import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Loading from '../components/Loading'
import Pagination from '../components/Pagination'
import Modal from '../components/Modal'
import { getProducts, createProduct, updateProduct, deleteProduct, type CreateProductData, type UpdateProductData } from '../api'
import type { Product } from '../types'
import { StatusMap } from '../types'

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [modalOpen, setModalOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<CreateProductData>({
    name: '',
    description: '',
    image: '',
    pricePoints: 0,
    stock: 0
  })
  const [processing, setProcessing] = useState(false)
  const pageSize = 10

  const loadProducts = async () => {
    setLoading(true)
    try {
      const data = await getProducts({
        page,
        pageSize,
        ...(statusFilter && { status: statusFilter })
      }) as { products: Product[], total: number }
      setProducts(data.products)
      setTotal(data.total)
    } catch (err) {
      console.error('加载礼品列表失败:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [page, statusFilter])

  const openCreate = () => {
    setIsEdit(false)
    setFormData({
      name: '',
      description: '',
      image: '',
      pricePoints: 0,
      stock: 0
    })
    setCurrentProduct(null)
    setModalOpen(true)
  }

  const openEdit = (product: Product) => {
    setIsEdit(true)
    setCurrentProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      image: product.image,
      pricePoints: product.pricePoints,
      stock: product.stock
    })
    setModalOpen(true)
  }

  const handlePublish = async (product: Product) => {
    if (!confirm(`确认上架「${product.name}」吗？`)) return
    setProcessing(true)
    try {
      await updateProduct(product.id, { status: 'ACTIVE' })
      alert('上架成功')
      loadProducts()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setProcessing(false)
    }
  }

  const handleUnpublish = async (product: Product) => {
    if (!confirm(`确认下架「${product.name}」吗？`)) return
    setProcessing(true)
    try {
      await deleteProduct(product.id)
      alert('下架成功')
      loadProducts()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setProcessing(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.pricePoints || formData.pricePoints <= 0 || formData.stock === undefined) {
      alert('请填写完整信息，积分必须大于0')
      return
    }

    setProcessing(true)
    try {
      if (isEdit && currentProduct) {
        const updateData: UpdateProductData = { ...formData }
        await updateProduct(currentProduct.id, updateData)
        alert('更新成功')
      } else {
        await createProduct(formData)
        alert('创建成功')
      }
      setModalOpen(false)
      loadProducts()
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
      <Layout title="礼品管理">
        <Loading />
      </Layout>
    )
  }

  return (
    <Layout title="礼品管理">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-4">
          <select
            className="form-input w-auto"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
          >
            <option value="">全部状态</option>
            <option value="ACTIVE">上架中</option>
            <option value="INACTIVE">已下架</option>
          </select>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          创建礼品
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-cell font-semibold text-gray-700 text-left">礼品名称</th>
                <th className="table-cell font-semibold text-gray-700 text-left">所需积分</th>
                <th className="table-cell font-semibold text-gray-700 text-left">库存</th>
                <th className="table-cell font-semibold text-gray-700 text-left">状态</th>
                <th className="table-cell font-semibold text-gray-700 text-left">创建时间</th>
                <th className="table-cell font-semibold text-gray-700 text-left">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="table-cell font-medium text-gray-900">{product.name}</td>
                  <td className="table-cell text-gray-600">{product.pricePoints}</td>
                  <td className="table-cell text-gray-600">{product.stock}</td>
                  <td className="table-cell">{getStatusBadge(product.status)}</td>
                  <td className="table-cell text-gray-600">
                    {new Date(product.createdAt).toLocaleString()}
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        className="text-sm text-blue-600 hover:text-blue-800"
                        onClick={() => openEdit(product)}
                      >
                        编辑
                      </button>
                      {product.status === 'ACTIVE' ? (
                        <button
                          className="text-sm text-red-600 hover:text-red-800"
                          onClick={() => handleUnpublish(product)}
                          disabled={processing}
                        >
                          下架
                        </button>
                      ) : (
                        <button
                          className="text-sm text-green-600 hover:text-green-800"
                          onClick={() => handlePublish(product)}
                          disabled={processing}
                        >
                          上架
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
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

      {/* 创建/编辑模态框 */}
      <Modal
        title={isEdit ? '编辑礼品' : '创建礼品'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn-outline" onClick={() => setModalOpen(false)}>
              取消
            </button>
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={processing}
            >
              {processing ? '保存中...' : '保存'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="form-label">礼品名称</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入礼品名称"
            />
          </div>
          <div>
            <label className="form-label">礼品描述</label>
            <textarea
              className="form-input h-24"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="请输入礼品描述"
            ></textarea>
          </div>
          <div>
            <label className="form-label">图片URL</label>
            <input
              type="text"
              className="form-input"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="请输入图片URL"
            />
          </div>
          <div>
            <label className="form-label">所需积分</label>
            <input
              type="number"
              className="form-input"
              value={formData.pricePoints}
              onChange={(e) => setFormData({ ...formData, pricePoints: Number(e.target.value) })}
              placeholder="请输入所需积分"
              min="1"
            />
          </div>
          <div>
            <label className="form-label">库存数量</label>
            <input
              type="number"
              className="form-input"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              placeholder="请输入库存数量"
              min="0"
            />
          </div>
        </div>
      </Modal>
    </Layout>
  )
}

export default Products
