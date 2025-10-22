import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [activeLanguage, setActiveLanguage] = useState('EN');

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/orders', label: 'Orders', icon: '📦' },
    { href: '/templates', label: 'Templates', icon: '📄' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
    { href: '/help', label: 'Help & Support', icon: '❓' }
  ];

  const languages = ['EN', 'हि', 'मराठी'];

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
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex justify-around mt-6">
        {languages.map((lang) => (
          <button 
            key={lang}
            onClick={() => setActiveLanguage(lang)}
            className={`
              px-3 py-1 rounded border border-white 
              ${activeLanguage === lang 
                ? 'bg-white text-primary' 
                : 'hover:bg-primary-light'}
            `}
          >
            {lang}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
