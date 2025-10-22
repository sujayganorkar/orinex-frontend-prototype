import React, { useState } from 'react';
import Layout from '@/components/Layout';

const Orders: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Unread');

  const tabs = ['Unread', 'Pending', 'Completed'];

  const orders = [
    { 
      client: 'Sharma Metal Works', 
      summary: 'New order inquiry', 
      time: '10 min ago',
      status: 'unread',
      badge: 3
    },
    { 
      client: 'Sai Engineering', 
      summary: 'Quotation ready for review', 
      time: '45 min ago',
      status: 'pending',
      badge: 5
    },
    { 
      client: 'Patel Fabricators', 
      summary: 'Invoice ready for approval', 
      time: '1 hour ago',
      status: 'completed',
      badge: 0
    }
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order Management</h1>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search orders..."
              className="w-80 px-4 py-2 rounded-full border border-gray-300"
            />
          </div>
        </div>

        <div className="flex border-b mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-2 relative
                ${activeTab === tab 
                  ? 'text-primary font-bold border-b-2 border-primary' 
                  : 'text-gray-600'}
              `}
            >
              {tab}
              {tab === 'Unread' && <span className="ml-2 bg-primary text-white rounded-full px-2 py-1 text-xs">3</span>}
              {tab === 'Pending' && <span className="ml-2 bg-primary text-white rounded-full px-2 py-1 text-xs">5</span>}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {orders.map((order, index) => (
            <div 
              key={index} 
              className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center"
            >
              <div>
                <div className="font-bold">{order.client}</div>
                <div className="text-sm text-gray-500">{order.summary} - {order.time}</div>
              </div>
              <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition">Process Now</button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
