
import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, PlusCircle, History, Wallet, Settings } from 'lucide-react'

const BottomNav: React.FC = () => {
  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/send', icon: PlusCircle, label: '发积分' },
    { path: '/history', icon: History, label: '流水' },
    { path: '/balance', icon: Wallet, label: '余额' },
    { path: '/settings', icon: Settings, label: '设置' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `
              flex flex-col items-center justify-center space-y-1 min-w-[20%] py-1
              ${isActive ? 'text-primary' : 'text-gray-500'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-6 h-6 ${isActive ? 'fill-primary/10' : ''}`} />
                <span className="text-xs">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default BottomNav
