import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ProgressBar from '@/components/ProgressBar';
import Link from 'next/link';
import OrderProcessingModal from '@/components/OrderProcessingModal';

interface Order {
  id: string;
  client: string;
  summary: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  status: 'unread' | 'pending' | 'quotations' | 'invoices';
  progress?: number;
  amount?: string;
  enquiryEmail?: string;
  type?: 'enquiry' | 'purchase_order';
  processedDetails?: {
    steps: string[];
    timestamp: Date;
  };
}

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const stats = [
    { title: 'Orders Today', value: '12', change: '+8%', color: 'blue' },
    { title: 'Active Workflows', value: '3', change: '+1', color: 'green' },
    { title: 'Pending Actions', value: '5', change: '-2', color: 'orange' },
    { title: 'Revenue (MTD)', value: '₹2.45L', change: '+15%', color: 'purple' }
  ];

  const [recentOrders, setRecentOrders] = useState<any[]>([
    {
      id: 'ORD-001',
      client: 'Tata Precision',
      summary: 'Quotation workflow executing',
      time: '25 min ago',
      priority: 'high',
      status: 'pending',
      progress: 75,
      amount: '₹15,000',
      type: 'enquiry'
    },
    {
      id: 'ORD-002',
      client: 'Mahindra Engineering',
      summary: 'Invoice generated',
      time: '2 hours ago',
      priority: 'medium',
      status: 'invoices',
      progress: 100,
      amount: '₹25,000',
      type: 'purchase_order',
      processedDetails: {
        steps: ['Invoice generated', 'Email drafted and sent'],
        timestamp: new Date()
      }
    },
    {
      id: 'ORD-003',
      client: 'Bharat Forge Ltd.',
      summary: 'New order received',
      time: '4 hours ago',
      priority: 'high',
      status: 'unread',
      progress: 0,
      amount: '₹18,500',
      enquiryEmail: 'We need MS Round Bar with cutting service.',
      type: 'enquiry'
    }
  ]);

  const [processingOrder, setProcessingOrder] = useState<any | null>(null);
  const [showProcessingModal, setShowProcessingModal] = useState(false);

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  // Helper function to highlight matching text
  const highlightMatches = (text: string, query: string): JSX.Element | string => {
    if (!query || query.length < 3) return text;

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const parts: (JSX.Element | string)[] = [];

    let lastIndex = 0;
    let index = lowerText.indexOf(lowerQuery);

    while (index !== -1) {
      // Add text before match
      if (index > lastIndex) {
        parts.push(text.substring(lastIndex, index));
      }

      // Add highlighted match
      parts.push(
        <span key={`${index}-${lastIndex}`} className="bg-yellow-200 font-semibold">
          {text.substring(index, index + query.length)}
        </span>
      );

      lastIndex = index + query.length;
      index = lowerText.indexOf(lowerQuery, lastIndex);
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? <span>{parts}</span> : text;
  };

  // Helper function to check if order matches search query
  const matchesSearch = (order: Order, query: string): boolean => {
    if (query.length < 3) return true;

    const lowerQuery = query.toLowerCase();

    return (
      order.id.toLowerCase().includes(lowerQuery) ||
      order.client.toLowerCase().includes(lowerQuery) ||
      order.summary.toLowerCase().includes(lowerQuery) ||
      order.priority.toLowerCase().includes(lowerQuery)
    );
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.currentTarget.value);
  };

  // Handle Enter key
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Search already happens in real-time, just prevent form submission
      e.preventDefault();
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Filter recent orders based on search
  const filteredRecentOrders = recentOrders.filter(order => matchesSearch(order, searchQuery));

  const handleProcessOrder = (order: Order) => {
    setProcessingOrder(order);
    setShowProcessingModal(true);
  };

  const handleOrderProcessed = (updatedOrder: Order) => {
    setRecentOrders(recentOrders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    setShowProcessingModal(false);
    setProcessingOrder(null);
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
                  placeholder="Search by Order ID, Client, Summary, etc..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  className="w-80 pl-9 pr-9 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-primary focus:outline-none transition-colors text-sm"
                />
                <svg
                  className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Clear search"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
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
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
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
                {filteredRecentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {filteredRecentOrders.map(order => (
                      <div key={order.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-medium text-gray-900">{highlightMatches(order.client, searchQuery)}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getPriorityColor(order.priority)}`}>
                              {order.priority.toUpperCase()}
                            </span>
                          </div>
                          <button
                            onClick={() => handleProcessOrder(order)}
                            className="px-3 py-1.5 bg-primary text-white text-sm rounded-md hover:bg-primary-dark transition-colors"
                          >
                            Process
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {highlightMatches(order.summary, searchQuery)} • {order.time}
                        </p>
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
                ) : (
                  <div className="text-center py-8">
                    <svg
                      className="w-12 h-12 text-gray-400 mx-auto mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">No results found</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      No orders match "<strong>{searchQuery}</strong>"
                    </p>
                    <button
                      onClick={handleClearSearch}
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      Clear search
                    </button>
                  </div>
                )}
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
                  <Link href="/orders?tab=pending">
                    <button className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-medium text-gray-900 group-hover:text-purple-900">Pending Orders</div>
                          <div className="text-sm text-gray-600">Orders awaiting action</div>
                        </div>
                      </div>
                    </button>
                  </Link>
                  <Link href="/workflows">
                    <button className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors group">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-medium text-gray-900 group-hover:text-green-900">Build Workflow</div>
                          <div className="text-sm text-gray-600">Automate processes</div>
                        </div>
                      </div>
                    </button>
                  </Link>
                  <Link href="/templates">
                    <button className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-medium text-gray-900 group-hover:text-blue-900">Create Template</div>
                          <div className="text-sm text-gray-600">Design new documents</div>
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

      {/* Processing Modal */}
      {showProcessingModal && processingOrder && (
        <OrderProcessingModal
          order={processingOrder}
          onClose={() => setShowProcessingModal(false)}
          onProcessed={handleOrderProcessed}
        />
      )}
    </Layout>
  );
};

export default Dashboard;
