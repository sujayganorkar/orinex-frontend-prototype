import React, { useState } from 'react';

interface Order {
  id: string;
  client: string;
  summary: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  isUrgent?: boolean;
}

interface DragDropOrdersProps {
  orders: Order[];
  onOrdersReorder: (orders: Order[]) => void;
}

const DragDropOrders: React.FC<DragDropOrdersProps> = ({ orders, onOrdersReorder }) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, orderId: string) => {
    setDraggedItem(orderId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragOver = (e: React.DragEvent, orderId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(orderId);
  };

  const handleDrop = (e: React.DragEvent, dropTargetId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === dropTargetId) return;

    const draggedIndex = orders.findIndex(order => order.id === draggedItem);
    const targetIndex = orders.findIndex(order => order.id === dropTargetId);

    const newOrders = [...orders];
    const [draggedOrder] = newOrders.splice(draggedIndex, 1);
    newOrders.splice(targetIndex, 0, draggedOrder);

    onOrdersReorder(newOrders);
  };

  const getPriorityColor = (priority: Order['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-2">
      {orders.map((order, index) => (
        <div
          key={order.id}
          draggable
          onDragStart={(e) => handleDragStart(e, order.id)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, order.id)}
          onDrop={(e) => handleDrop(e, order.id)}
          className={`
            bg-white p-4 rounded-lg shadow-sm border-l-4 cursor-move
            transition-all duration-200 hover:shadow-md hover:scale-[1.02]
            ${getPriorityColor(order.priority)}
            ${draggedItem === order.id ? 'opacity-50 scale-95' : ''}
            ${dragOverItem === order.id ? 'ring-2 ring-primary ring-opacity-50' : ''}
            ${order.isUrgent ? 'animate-pulse ring-2 ring-red-400' : ''}
          `}
        >
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">#{index + 1}</span>
                <div className="font-bold">{order.client}</div>
                {order.isUrgent && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    URGENT
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500">{order.summary} - {order.time}</div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`
                text-xs px-2 py-1 rounded-full
                ${order.priority === 'high' ? 'bg-red-100 text-red-800' : ''}
                ${order.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${order.priority === 'low' ? 'bg-green-100 text-green-800' : ''}
              `}>
                {order.priority.toUpperCase()}
              </span>
              <div className="text-gray-400 cursor-move">
                ⋮⋮
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DragDropOrders;