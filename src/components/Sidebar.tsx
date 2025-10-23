import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar: React.FC = () => {
  const router = useRouter();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/orders', label: 'Orders' },
    { href: '/templates', label: 'Templates' },
    { href: '/settings', label: 'Settings' },
    { href: '/help', label: 'Help & Support' }
  ];

  return (
    <div className="w-64 bg-primary text-white flex flex-col p-6">
      <div className="text-2xl font-bold text-center mb-10">ORINEX</div>
      
      <nav className="space-y-2 flex-grow">
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className={`
              flex items-center p-3 rounded-md transition-colors 
              ${router.pathname === item.href 
                ? 'bg-secondary-light' 
                : 'hover:bg-primary-light'}
            `}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
