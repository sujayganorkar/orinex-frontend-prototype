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
    { title: 'Orders Today', value: '12', change: '+8%', color: 'blue' },
    { title: 'Active Workflows', value: '3', change: '+1', color: 'green' },
    { title: 'Pending Actions', value: '5', change: '-2', color: 'orange' },
    { title: 'Revenue (MTD)', value: '₹2.45L', change: '+15%', color: 'purple' }
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
  ]);

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
                <span className="absolute left-3 top-3 text-gray-400">Search</span>
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
                  <div className={`w-12 h-12 bg-gradient-to-br ${getStatColor(stat.color)} rounded-lg flex items-center justify-center text-white font-bold`}>
                    {stat.title.charAt(0)}
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
                        <span className="text-blue-600 text-xl w-8 h-8 flex items-center justify-center bg-white rounded font-bold">T</span>
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
                        <span className="text-green-600 text-xl w-8 h-8 flex items-center justify-center bg-white rounded font-bold">W</span>
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
                        <span className="text-purple-600 text-xl w-8 h-8 flex items-center justify-center bg-white rounded font-bold">O</span>
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
