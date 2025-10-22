import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';

const Orders: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Unread');

  const tabs = ['Unread', 'Pending', 'Completed'];

  const orders = [
    { 
      id: 'ORD-2024-001',
      client: 'Sharma Metal Works', 
      summary: 'New order inquiry', 
      time: '10 min ago',
      status: 'unread',
      badge: 3
    },
    { 
      id: 'ORD-2024-002',
      client: 'Sai Engineering', 
      summary: 'Quotation ready for review', 
      time: '45 min ago',
      status: 'pending',
      badge: 5
    },
    { 
      id: 'ORD-2024-003',
      client: 'Patel Fabricators', 
      summary: 'Invoice ready for approval', 
      time: '1 hour ago',
      status: 'completed',
      badge: 0
    }
  ];

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'Unread') return order.status === 'unread';
    if (activeTab === 'Pending') return order.status === 'pending';
    if (activeTab === 'Completed') return order.status === 'completed';
    return true;
  });

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
          {filteredOrders.map((order, index) => (
            <div 
              key={index} 
              className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center hover:shadow-md transition-shadow"
            >
              <div>
                <div className="font-bold">{order.client}</div>
                <div className="text-sm text-gray-500">{order.summary} - {order.time}</div>
                <div className="text-xs text-gray-400 mt-1">Order ID: {order.id}</div>
              </div>
              <div className="flex gap-2">
                <Link href="/order-detail">
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">
                    View Details
                  </button>
                </Link>
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition">
                  Process Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No orders in {activeTab.toLowerCase()}</div>
            <div className="text-gray-500 text-sm">
              {activeTab === 'Unread' && 'New orders will appear here when they arrive'}
              {activeTab === 'Pending' && 'Orders waiting for action will be shown here'}
              {activeTab === 'Completed' && 'Completed orders will be listed here'}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-primary">8</div>
            <div className="text-sm text-gray-600">Total Today</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-green-600">5</div>
            <div className="text-sm text-gray-600">Processed</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-orange-600">3</div>
            <div className="text-sm text-gray-600">Pending Action</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
