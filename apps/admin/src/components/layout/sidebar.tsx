'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  UserPlus,
  Calendar,
  Mail,
  BarChart3,
  Settings,
  LogOut,
  Brain,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/leads', label: 'Leads', icon: UserPlus },
  { href: '/bookings', label: 'Bookings', icon: Calendar },
  { href: '/campaigns', label: 'Campaigns', icon: Mail },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/ai-optimization', label: 'AI Assistant', icon: Brain },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative w-[70px] h-[70px] rounded-[70%] overflow-hidden">
            <Image
              src="https://image2url.com/r2/bucket3/images/1767997771278-7a3bc034-fad1-4f13-bd1e-48c88bf1c8a5.jpg"
              alt="MYGlamBeauty Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        <p className="text-xs text-gray-400">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-brand-500 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-sm font-bold">
            A
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs text-gray-400">admin@myglambeauty.com</p>
          </div>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
