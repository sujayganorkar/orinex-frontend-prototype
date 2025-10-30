import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import OrderProcessingModal from '@/components/OrderProcessingModal';

interface Order {
  id: string;
  client: string;
  summary: string;
  time: string;
  status: 'unread' | 'pending' | 'quotations' | 'invoices';
  amount: string;
  priority: 'high' | 'medium' | 'low';
  enquiryEmail?: string;
  type?: 'enquiry' | 'purchase_order';
  processedDetails?: {
    steps: string[];
    timestamp: Date;
  };
}

interface SearchMatch {
  text: string;
  highlighted: string;
}

const Orders: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('unread');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle query parameter for tab selection
  useEffect(() => {
    if (router.isReady) {
      const tabParam = router.query.tab as string;
      if (tabParam && ['unread', 'pending', 'quotations', 'invoices'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, [router.isReady, router.query.tab]);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-2024-001',
      client: 'Sharma Metal Works',
      summary: 'New order inquiry',
      time: '10 min ago',
      status: 'unread',
      amount: '₹10,750',
      priority: 'high',
      enquiryEmail: 'Dear Sir/Madam,\n\nWe are interested in MS Round Bar with cutting and threading service.\n\nPlease provide a quotation.\n\nBest regards',
      type: 'enquiry'
    },
    {
      id: 'ORD-2024-002',
      client: 'Sai Engineering',
      summary: 'Quotation ready for review',
      time: '45 min ago',
      status: 'pending',
      amount: '₹24,250',
      priority: 'medium',
      type: 'enquiry'
    },
    {
      id: 'ORD-2024-003',
      client: 'Patel Fabricators',
      summary: 'Purchase order received',
      time: '1 day ago',
      status: 'unread',
      amount: '₹29,500',
      priority: 'medium',
      enquiryEmail: 'We would like to place a purchase order for Steel Plates with plasma cutting and edge finishing.',
      type: 'purchase_order'
    },
    {
      id: 'ORD-2024-004',
      client: 'ABC Manufacturing',
      summary: 'Quotation sent',
      time: '2 hours ago',
      status: 'quotations',
      amount: '₹15,200',
      priority: 'medium',
      type: 'enquiry',
      processedDetails: {
        steps: ['Email discrepancy addressed', 'Quotation generated', 'Email drafted and sent'],
        timestamp: new Date()
      }
    },
    {
      id: 'ORD-2024-005',
      client: 'XYZ Corp',
      summary: 'Invoice sent',
      time: '3 hours ago',
      status: 'invoices',
      amount: '₹45,000',
      priority: 'high',
      type: 'purchase_order',
      processedDetails: {
        steps: ['Invoice generated', 'Email drafted and sent'],
        timestamp: new Date()
      }
    }
  ]);

  const [processingOrder, setProcessingOrder] = useState<Order | null>(null);
  const [showProcessingModal, setShowProcessingModal] = useState(false);

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
      order.amount.toLowerCase().includes(lowerQuery) ||
      order.status.toLowerCase().includes(lowerQuery) ||
      order.priority.toLowerCase().includes(lowerQuery)
    );
  };

  // Filter orders: first by search, then by active tab
  const filteredOrders = orders
    .filter(order => matchesSearch(order, searchQuery))
    .filter(order => order.status === activeTab);

  // For tab counts: show filtered count if searching, otherwise show total per tab
  const getTabCount = (tabStatus: string): number => {
    if (searchQuery.length < 3) {
      return orders.filter(o => o.status === tabStatus).length;
    }
    return orders
      .filter(o => matchesSearch(o, searchQuery))
      .filter(o => o.status === tabStatus).length;
  };

  const tabs = [
    { id: 'unread', label: 'Unread', count: getTabCount('unread') },
    { id: 'pending', label: 'Pending', count: getTabCount('pending') },
    { id: 'quotations', label: 'Quotations', count: getTabCount('quotations') },
    { id: 'invoices', label: 'Invoices', count: getTabCount('invoices') }
  ];

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

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'unread': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'quotations': return 'bg-green-100 text-green-700';
      case 'invoices': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleProcessOrder = (order: Order) => {
    setProcessingOrder(order);
    setShowProcessingModal(true);
  };

  const handleOrderProcessed = (updatedOrder: Order) => {
    setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
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
              <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
              <p className="text-gray-600 mt-1">Track and manage all your customer orders</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by Order ID, Client, Amount, etc..."
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
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-card border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Today</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              {/* <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"> */}
              {/* </div> */}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-card border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processed</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
              {/* <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              </div> */}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-card border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Action</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              {/* <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"> */}
              {/* </div> */}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-card border border-gray-100">
          {/* Tabs */}
          <div className="border-b border-gray-100">
            <nav className="flex px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Table Content */}
          <div className="overflow-hidden">
            {filteredOrders.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {highlightMatches(order.id, searchQuery)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {highlightMatches(order.summary, searchQuery)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {highlightMatches(order.client, searchQuery)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                          {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {highlightMatches(order.amount, searchQuery)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {(order.status === 'unread' || order.status === 'pending') ? (
                          <button
                            onClick={() => handleProcessOrder(order)}
                            className="px-3 py-1.5 rounded-md text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
                          >
                            Process Now
                          </button>
                        ) : (
                          <button
                            onClick={() => handleProcessOrder(order)}
                            className="px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                          >
                            View Details
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  {searchQuery.length >= 3 ? (
                    <svg
                      className="w-8 h-8 text-gray-400"
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
                  ) : (
                    <span className="text-2xl text-gray-400 font-bold">O</span>
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery.length >= 3 ? 'No results found' : `No orders in ${activeTab}`}
                </h3>
                <p className="text-gray-500">
                  {searchQuery.length >= 3 ? (
                    <>
                      No orders match "<strong>{searchQuery}</strong>" in the {activeTab} section.{' '}
                      <button
                        onClick={handleClearSearch}
                        className="text-primary hover:underline font-medium"
                      >
                        Clear search
                      </button>
                      {' '}to see all orders.
                    </>
                  ) : (
                    <>
                      {activeTab === 'unread' && 'New orders will appear here when they arrive'}
                      {activeTab === 'pending' && 'Orders waiting for quotation generation will be shown here'}
                      {activeTab === 'quotations' && 'Completed quotations will be listed here'}
                      {activeTab === 'invoices' && 'Generated invoices will be listed here'}
                    </>
                  )}
                </p>
              </div>
            )}
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

export default Orders;
