import React, { useState } from 'react';
import Layout from '@/components/Layout';

// Define the exact Order type (must match DragDropOrders component)
interface Order {
  id: string;
  client: string;
  summary: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  isUrgent: boolean;
  status: 'unread' | 'pending' | 'completed';
}

const EnhancedDashboard: React.FC = () => {
  const stats = [
    { title: 'Orders Processed Today', value: '12' },
    { title: 'Pending Invoices', value: '2' },
    { title: 'Pending Quotations', value: '5' },
    { title: 'Monthly Revenue', value: '₹2.45L' }
  ];

  // Initialize with consistent typing
  const [orders, setOrders] = useState<Order[]>([
    { 
      id: '1',
      client: 'Tata Precision Components', 
      summary: 'Quotation sent', 
      time: '25 min ago',
      priority: 'high',
      isUrgent: true,
      status: 'pending'
    },
    { 
      id: '2',
      client: 'Mahindra Engineering', 
      summary: 'Invoice generated', 
      time: '2 hours ago',
      priority: 'medium',
      isUrgent: false,
      status: 'completed'
    },
    { 
      id: '3',
      client: 'Bharat Forge Ltd.', 
      summary: 'New order received', 
      time: '4 hours ago',
      priority: 'high',
      isUrgent: true,
      status: 'unread'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'all' | 'urgent' | 'completed'>('all');

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    switch(activeTab) {
      case 'urgent':
        return order.isUrgent;
      case 'completed':
        return order.status === 'completed';
      default:
        return true;
    }
  });

  // Function to handle order reordering (for DragDropOrders component)
  const handleOrdersReorder = (reorderedOrders: Order[]): void => {
    setOrders(reorderedOrders);
  };

  // Function to handle order updates
  const updateOrder = (orderId: string, updates: Partial<Order>): void => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, ...updates } : order
      )
    );
  };

  // Function to remove order
  const removeOrder = (orderId: string): void => {
    setOrders(prevOrders => 
      prevOrders.filter(order => order.id !== orderId)
    );
  };

  const getPriorityColor = (priority: Order['priority']): string => {
    switch(priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Hello, Prakash!</h1>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search orders, clients, or documents..."
              className="w-80 px-4 py-2 rounded-full border border-gray-300"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="text-sm text-gray-500 mb-2">{stat.title}</h3>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          {[
            { key: 'all', label: 'All Orders' },
            { key: 'urgent', label: 'Urgent' },
            { key: 'completed', label: 'Completed' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`
                px-4 py-2 relative
                ${activeTab === tab.key 
                  ? 'text-primary font-bold border-b-2 border-primary' 
                  : 'text-gray-600'}
              `}
            >
              {tab.label}
              {tab.key === 'urgent' && (
                <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                  {orders.filter(order => order.isUrgent).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Recent Activity */}
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        
        {/* Conditional rendering: Use DragDropOrders if available, otherwise fallback */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center"
            >
              <div className="flex-1">
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
                <div className="text-sm text-gray-500">{order.summary} - {order.time}</div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => updateOrder(order.id, { status: 'completed' })}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
                >
                  Process
                </button>
                <button 
                  onClick={() => removeOrder(order.id)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No orders found for the selected filter.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EnhancedDashboard;
