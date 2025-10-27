import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar: React.FC = () => {
  const router = useRouter();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/orders', label: 'Orders', icon: '📋' },
    { href: '/templates', label: 'Templates', icon: '📄' },
    { href: '/workflows', label: 'Workflows', icon: '⚡' },
    { href: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 z-10">
      {/* Header */}
      <div className="h-16 flex items-center justify-center border-b border-gray-100">
        <div className="text-2xl font-bold text-primary">ORINEX</div>
      </div>
      
      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = router.pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`
                group flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${isActive 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-xs font-medium text-blue-900">Need Help?</div>
          <div className="text-xs text-blue-700 mt-1">Contact support</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
