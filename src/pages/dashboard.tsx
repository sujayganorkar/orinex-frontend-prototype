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
  status: 'unread' | 'pending' | 'completed';
  progress?: number;
}

const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Orders Today', value: '12', change: '+8%', color: 'blue', icon: 'chart' },
    { title: 'Active Workflows', value: '3', change: '+1', color: 'green', icon: 'workflow' },
    { title: 'Pending Actions', value: '5', change: '-2', color: 'orange', icon: 'clock' },
    { title: 'Revenue (MTD)', value: '₹2.45L', change: '+15%', color: 'purple', icon: 'currency' }
  ];

  const [recentOrders] = useState<Order[]>([
    { 
      id: 'ORD-001',
      client: 'Tata Precision', 
      summary: 'Quotation workflow executing', 
      time: '25 min ago',
      priority: 'high',
      status: 'pending',
      progress: 75
    },
    { 
      id: 'ORD-002',
      client: 'Mahindra Engineering', 
      summary: 'Invoice generated', 
      time: '2 hours ago',
      priority: 'medium',
      status: 'completed',
      progress: 100
    },
    { 
      id: 'ORD-003',
      client: 'Bharat Forge Ltd.', 
      summary: 'New order received', 
      time: '4 hours ago',
      priority: 'high',
      status: 'unread',
      progress: 0
    }
  ];

  const getStatColor = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      orange: 'from-orange-500 to-orange-600',
      purple: 'from-purple-500 to-purple-600'
    };
    return colors[color as keyof typeof colors];
  };

  const getPriorityColor = (priority: Order['priority']) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const renderStatIcon = (icon: string) => {
    switch(icon) {
      case 'chart':
        return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
      case 'workflow':
        return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
      case 'clock':
        return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case 'currency':
        return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>;
      default:
        return <div className="w-6 h-6 bg-white bg-opacity-30 rounded"></div>;
    }
  };

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Good morning, Prakash</h1>
              <p className="text-gray-600 mt-1">Here's what's happening with your orders today.</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search orders..."
                  className="w-80 pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-primary focus:outline-none transition-colors"
                />
                <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <Link href="/help">
                <button className="px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  Help
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${getStatColor(stat.color)} rounded-lg flex items-center justify-center text-white`}>
                    {renderStatIcon(stat.icon)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="col-span-2">
            <div className="bg-white rounded-xl shadow-card border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                  <Link href="/orders" className="text-sm text-primary hover:text-primary-dark">
                    View all →
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentOrders.map(order => (
                    <div key={order.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-gray-900">{order.client}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getPriorityColor(order.priority)}`}>
                            {order.priority.toUpperCase()}
                          </span>
                        </div>
                        <Link href={`/order-detail?id=${order.id}`}>
                          <button className="px-3 py-1.5 bg-primary text-white text-sm rounded-md hover:bg-primary-dark transition-colors">
                            Process
                          </button>
                        </Link>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{order.summary} • {order.time}</p>
                      {order.progress !== undefined && order.progress > 0 && (
                        <ProgressBar 
                          progress={order.progress} 
                          size="sm" 
                          color={order.progress === 100 ? 'success' : 'primary'} 
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="bg-white rounded-xl shadow-card border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <Link href="/templates">
                    <button className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          <div className="font-medium text-gray-900 group-hover:text-blue-900">Create Template</div>
                          <div className="text-sm text-gray-600">Design new documents</div>
                        </div>
                      </div>
                    </button>
                  </Link>
                  <Link href="/workflows">
                    <button className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors group">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <div>
                          <div className="font-medium text-gray-900 group-hover:text-green-900">Build Workflow</div>
                          <div className="text-sm text-gray-600">Automate processes</div>
                        </div>
                      </div>
                    </button>
                  </Link>
                  <Link href="/orders">
                    <button className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <div>
                          <div className="font-medium text-gray-900 group-hover:text-purple-900">View Orders</div>
                          <div className="text-sm text-gray-600">Manage all orders</div>
                        </div>
                      </div>
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="mt-6 bg-white rounded-xl shadow-card border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">AI Processing</span>
                    <span className="flex items-center text-green-600 text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email Integration</span>
                    <span className="flex items-center text-green-600 text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Storage</span>
                    <span className="text-sm text-gray-600">85% used</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
