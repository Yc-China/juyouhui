import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  LayoutDashboard, 
  Building2, 
  ClipboardCheck, 
  Gift, 
  ShoppingBag,
  LogOut,
  Menu,
  X
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
  title: string
}

const menuItems = [
  { path: '/', name: '数据统计', icon: LayoutDashboard },
  { path: '/applications', name: '入驻审核', icon: ClipboardCheck },
  { path: '/merchants', name: '商家管理', icon: Building2 },
  { path: '/products', name: '礼品管理', icon: Gift },
  { path: '/orders', name: '兑换订单', icon: ShoppingBag },
]

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { admin, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-xl font-bold text-primary">聚优惠 · 管理后台</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {admin?.name || admin?.username}
            </span>
            <button 
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              退出登录
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 侧边导航栏 - 移动端弹窗 */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-64 bg-white h-full" onClick={e => e.stopPropagation()}>
              <nav className="py-4">
                {menuItems.map(item => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 ${
                        isActive 
                          ? 'bg-primary/10 text-primary border-r-4 border-primary' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon size={20} />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        )}

        {/* 侧边导航栏 - 桌面版 */}
        <aside className="hidden lg:block w-64 bg-white h-[calc(100vh-64px)] border-r border-gray-200">
          <nav className="py-4">
            {menuItems.map(item => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    isActive 
                      ? 'bg-primary/10 text-primary border-r-4 border-primary' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
