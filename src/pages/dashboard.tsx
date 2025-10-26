import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ProgressBar from '@/components/ProgressBar';
import Link from 'next/link';

interface Order {
  id: string;
  client: string;
  summary: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  isUrgent: boolean;
  status: 'unread' | 'pending' | 'completed';
  progress?: number;
}

const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Orders Processed Today', value: '12', color: 'bg-blue-500' },
    { title: 'Active Workflows', value: '3', color: 'bg-green-500' },
    { title: 'Pending Quotations', value: '5', color: 'bg-yellow-500' },
    { title: 'Monthly Revenue', value: '₹2.45L', color: 'bg-purple-500' }
  ];

  const [orders, setOrders] = useState<Order[]>([
    { 
      id: '1',
      client: 'Tata Precision', 
      summary: 'Quotation workflow executing', 
      time: '25 min ago',
      priority: 'high',
      isUrgent: true,
      status: 'pending',
      progress: 75
    },
    { 
      id: '2',
      client: 'Mahindra Engineering', 
      summary: 'Invoice generated', 
      time: '2 hours ago',
      priority: 'medium',
      isUrgent: false,
      status: 'completed',
      progress: 100
    },
    { 
      id: '3',
      client: 'Bharat Forge Ltd.', 
      summary: 'New order received', 
      time: '4 hours ago',
      priority: 'high',
      isUrgent: true,
      status: 'unread',
      progress: 0
    }
  ]);

  const getPriorityColor = (priority: Order['priority']): string => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Hello, Prakash!</h1>
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Search orders..."
              className="w-80 px-4 py-2 rounded-full border"
            />
            <Link href="/help">
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">
                Help
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-sm text-gray-500 mb-2">{stat.title}</h3>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="font-bold">{order.client}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(order.priority)}`}>
                    {order.priority.toUpperCase()}
                  </span>
                  {order.isUrgent && (
                    <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-semibold">
                      URGENT
                    </span>
                  )}
                </div>
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark text-sm">
                  Process
                </button>
              </div>
              
              <div className="text-sm text-gray-500 mb-3">{order.summary} - {order.time}</div>
              
              {order.progress !== undefined && order.progress > 0 && (
                <ProgressBar progress={order.progress} size="sm" color={order.progress === 100 ? 'success' : 'primary'} />
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
