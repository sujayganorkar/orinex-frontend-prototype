import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProgressBar from '@/components/ProgressBar';
import AnimatedCheckmark from '@/components/AnimatedCheckmark';
import SlideInNotification from '@/components/SlideInNotification';
import PulseEffect from '@/components/PulseEffect';
import DragDropOrders from '@/components/DragDropOrders';
import { useSoundAlert } from '@/hooks/useSoundAlert';

const EnhancedDashboard: React.FC = () => {
  const [notification, setNotification] = useState<{show: boolean, message: string, type: 'success' | 'warning' | 'error' | 'info'}>({
    show: false, message: '', type: 'info'
  });
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [orderProgress, setOrderProgress] = useState(45);
  const [hasUrgentOrders, setHasUrgentOrders] = useState(true);
  
  const { playUrgentAlert, playSuccessSound } = useSoundAlert({ enabled: true });

  const [orders, setOrders] = useState([
    { 
      id: '1',
      client: 'Sharma Metal Works', 
      summary: 'New order inquiry', 
      time: '10 min ago',
      priority: 'high' as const,
      isUrgent: true
    },
    { 
      id: '2',
      client: 'Sai Engineering', 
      summary: 'Quotation ready for review', 
      time: '45 min ago',
      priority: 'medium' as const
    },
    { 
      id: '3',
      client: 'Patel Fabricators', 
      summary: 'Invoice ready for approval', 
      time: '1 hour ago',
      priority: 'low' as const
    }
  ]);

  const stats = [
    { title: 'Orders Processed Today', value: '12', progress: 75 },
    { title: 'Time Saved This Week', value: '37.5 hours', progress: orderProgress },
    { title: 'Pending Actions', value: '3', progress: 30 },
    { title: 'Error Rate', value: '0%', progress: 100 }
  ];

  // Simulate urgent order alert
  useEffect(() => {
    if (hasUrgentOrders) {
      playUrgentAlert();
      const timer = setTimeout(() => setHasUrgentOrders(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [hasUrgentOrders, playUrgentAlert]);

  const handleProcessOrder = () => {
    setOrderProgress(prev => Math.min(prev + 15, 100));
    setShowCheckmark(true);
    playSuccessSound();
    setNotification({
      show: true,
      message: 'Order processed successfully!',
      type: 'success'
    });
    
    setTimeout(() => setShowCheckmark(false), 2000);
  };

  const simulateNewOrder = () => {
    setHasUrgentOrders(true);
    setNotification({
      show: true,
      message: 'New urgent order received!',
      type: 'warning'
    });
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Hello, Prakash!</h1>
            <AnimatedCheckmark isVisible={showCheckmark} size="md" />
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={simulateNewOrder}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition hover-lift"
            >
              Simulate New Order
            </button>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search orders, clients, or documents..."
                className="w-80 px-4 py-2 rounded-full border border-gray-300 hover-lift"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <PulseEffect 
              key={index} 
              isActive={stat.progress === 100}
              color="success"
            >
              <div className="bg-white p-6 rounded-lg shadow-md hover-lift">
                <h3 className="text-sm text-gray-500 mb-2">{stat.title}</h3>
                <p className="text-2xl font-bold text-primary mb-3">{stat.value}</p>
                <ProgressBar 
                  progress={stat.progress} 
                  size="sm"
                  color={stat.progress === 100 ? 'success' : 'primary'}
                />
              </div>
            </PulseEffect>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Order Priority Queue</h2>
              <span className="text-sm text-gray-500">Drag to reorder</span>
            </div>
            <DragDropOrders 
              orders={orders} 
              onOrdersReorder={setOrders}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <button 
                onClick={handleProcessOrder}
                className="w-full p-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition hover-lift flex items-center justify-center space-x-2"
              >
                <span>Process Next Order</span>
                <span>⚡</span>
              </button>
              
              <div className="bg-white p-4 rounded-lg shadow-sm hover-lift">
                <h3 className="font-semibold mb-2">Processing Progress</h3>
                <ProgressBar 
                  progress={orderProgress} 
                  label="Today's Goal" 
                  color="primary"
                />
              </div>

              <PulseEffect 
                isActive={hasUrgentOrders} 
                color="warning"
                intensity="high"
              >
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-red-600 mb-2">
                    {hasUrgentOrders ? '🚨 Urgent Orders' : '✅ All Clear'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {hasUrgentOrders 
                      ? 'You have urgent orders requiring immediate attention'
                      : 'No urgent orders at the moment'
                    }
                  </p>
                </div>
              </PulseEffect>
            </div>
          </div>
        </div>
      </div>

      <SlideInNotification 
        isVisible={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(prev => ({...prev, show: false}))}
      />
    </Layout>
  );
};

export default EnhancedDashboard;