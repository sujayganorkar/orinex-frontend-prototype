import React, { useState } from 'react';

interface WorkflowBlock {
  id: string;
  type: 'template' | 'condition' | 'action' | 'delay';
  x: number;
  y: number;
  config: any;
}

interface WorkflowBuilderProps {
  onSave: (workflow: any) => void;
  onCancel: () => void;
  initialWorkflow?: any;
}

const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ onSave, onCancel, initialWorkflow }) => {
  const [workflowName, setWorkflowName] = useState(initialWorkflow?.name || '');
  const [blocks, setBlocks] = useState<WorkflowBlock[]>(initialWorkflow?.blocks || []);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [draggedBlock, setDraggedBlock] = useState<WorkflowBlock | null>(null);

  const blockTypes = [
    { type: 'template', icon: '📄', label: 'Generate Template', color: 'bg-blue-100' },
    { type: 'condition', icon: '🔀', label: 'Condition', color: 'bg-yellow-100' },
    { type: 'action', icon: '⚡', label: 'Action', color: 'bg-green-100' },
    { type: 'delay', icon: '⏱️', label: 'Delay', color: 'bg-purple-100' }
  ];

  const handleDragStart = (blockType: string) => {
    const newBlock: WorkflowBlock = {
      id: `block_${Date.now()}`,
      type: blockType as any,
      x: 0,
      y: 0,
      config: {}
    };
    setDraggedBlock(newBlock);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedBlock) {
      const canvas = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - canvas.left;
      const y = e.clientY - canvas.top;
      
      setBlocks([...blocks, { ...draggedBlock, x, y }]);
      setDraggedBlock(null);
    }
  };

  const handleBlockMove = (id: string, x: number, y: number) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, x, y } : block
    ));
  };

  const handleBlockDelete = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
    if (selectedBlock === id) setSelectedBlock(null);
  };

  const handleBlockConfigUpdate = (config: any) => {
    if (selectedBlock) {
      setBlocks(blocks.map(block =>
        block.id === selectedBlock ? { ...block, config } : block
      ));
    }
  };

  const handleSave = () => {
    const workflow = {
      id: initialWorkflow?.id || `workflow_${Date.now()}`,
      name: workflowName,
      blocks,
      connections: [], // Can be extended for block connections
      createdAt: initialWorkflow?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSave(workflow);
  };

  const getBlockIcon = (type: string) => {
    return blockTypes.find(b => b.type === type)?.icon || '📦';
  };

  const getBlockColor = (type: string) => {
    return blockTypes.find(b => b.type === type)?.color || 'bg-gray-100';
  };

  const selectedBlockData = blocks.find(b => b.id === selectedBlock);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Workflow Builder</h2>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="px-4 py-2 border rounded-md w-80"
              placeholder="Enter workflow name..."
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Save Workflow
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Block Palette */}
          <div className="w-64 border-r p-4 bg-gray-50 overflow-auto">
            <h3 className="font-semibold mb-4">Workflow Blocks</h3>
            <div className="space-y-2">
              {blockTypes.map((blockType) => (
                <div
                  key={blockType.type}
                  draggable
                  onDragStart={() => handleDragStart(blockType.type)}
                  className={`${blockType.color} p-4 rounded-lg cursor-move hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{blockType.icon}</span>
                    <div>
                      <div className="font-semibold text-sm">{blockType.label}</div>
                      <div className="text-xs text-gray-600">
                        {blockType.type === 'template' && 'Generate a document'}
                        {blockType.type === 'condition' && 'Branch based on condition'}
                        {blockType.type === 'action' && 'Perform an action'}
                        {blockType.type === 'delay' && 'Wait for duration'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">💡 How to Use:</h4>
              <ul className="text-xs space-y-1 text-gray-700">
                <li>• Drag blocks to canvas</li>
                <li>• Click to configure</li>
                <li>• Connect blocks in sequence</li>
                <li>• Save when complete</li>
              </ul>
            </div>
          </div>

          {/* Center - Canvas */}
          <div 
            className="flex-1 relative bg-gray-100 overflow-auto"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            style={{
              backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          >
            {blocks.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎨</div>
                  <div className="text-lg font-semibold">Drag blocks here to build your workflow</div>
                  <div className="text-sm mt-2">Start by dragging a "Generate Template" block</div>
                </div>
              </div>
            )}

            {blocks.map((block, index) => (
              <div key={block.id}>
                {/* Block */}
                <div
                  className={`absolute cursor-pointer p-4 rounded-lg shadow-lg ${getBlockColor(block.type)} ${
                    selectedBlock === block.id ? 'ring-4 ring-primary' : ''
                  }`}
                  style={{
                    left: block.x,
                    top: block.y,
                    minWidth: '180px'
                  }}
                  onClick={() => setSelectedBlock(block.id)}
                  draggable
                  onDragEnd={(e) => {
                    const canvas = e.currentTarget.parentElement!.getBoundingClientRect();
                    handleBlockMove(block.id, e.clientX - canvas.left, e.clientY - canvas.top);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getBlockIcon(block.type)}</span>
                      <span className="font-semibold text-sm">
                        {blockTypes.find(b => b.type === block.type)?.label}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBlockDelete(block.id);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="text-xs text-gray-600">
                    {block.config.name || 'Not configured'}
                  </div>
                </div>

                {/* Connection Arrow to Next Block */}
                {index < blocks.length - 1 && (
                  <svg
                    className="absolute pointer-events-none"
                    style={{
                      left: 0,
                      top: 0,
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                      </marker>
                    </defs>
                    <line
                      x1={block.x + 90}
                      y1={block.y + 40}
                      x2={blocks[index + 1].x + 90}
                      y2={blocks[index + 1].y}
                      stroke="#3b82f6"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>

          {/* Right Sidebar - Configuration Panel */}
          <div className="w-80 border-l p-4 bg-gray-50 overflow-auto">
            <h3 className="font-semibold mb-4">Block Configuration</h3>
            
            {!selectedBlock && (
              <div className="text-center text-gray-400 mt-8">
                <div className="text-4xl mb-2">⚙️</div>
                <div className="text-sm">Select a block to configure</div>
              </div>
            )}

            {selectedBlock && selectedBlockData && (
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">{getBlockIcon(selectedBlockData.type)}</span>
                    <span className="font-semibold">
                      {blockTypes.find(b => b.type === selectedBlockData.type)?.label}
                    </span>
                  </div>

                  {/* Template Block Config */}
                  {selectedBlockData.type === 'template' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block mb-2 text-sm font-medium">Template Name</label>
                        <input
                          type="text"
                          value={selectedBlockData.config.name || ''}
                          onChange={(e) => handleBlockConfigUpdate({ ...selectedBlockData.config, name: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="Select template..."
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium">Output Format</label>
                        <select
                          value={selectedBlockData.config.format || 'docx'}
                          onChange={(e) => handleBlockConfigUpdate({ ...selectedBlockData.config, format: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="docx">DOCX</option>
                          <option value="pdf">PDF</option>
                          <option value="xlsx">XLSX</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Condition Block Config */}
                  {selectedBlockData.type === 'condition' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block mb-2 text-sm font-medium">Condition</label>
                        <select
                          value={selectedBlockData.config.condition || ''}
                          onChange={(e) => handleBlockConfigUpdate({ ...selectedBlockData.config, condition: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="">Select condition...</option>
                          <option value="amount_gt">Amount greater than</option>
                          <option value="amount_lt">Amount less than</option>
                          <option value="status_eq">Status equals</option>
                        </select>
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium">Value</label>
                        <input
                          type="text"
                          value={selectedBlockData.config.value || ''}
                          onChange={(e) => handleBlockConfigUpdate({ ...selectedBlockData.config, value: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="Enter value..."
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Block Config */}
                  {selectedBlockData.type === 'action' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block mb-2 text-sm font-medium">Action Type</label>
                        <select
                          value={selectedBlockData.config.actionType || ''}
                          onChange={(e) => handleBlockConfigUpdate({ ...selectedBlockData.config, actionType: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="">Select action...</option>
                          <option value="send_email">Send Email</option>
                          <option value="send_whatsapp">Send WhatsApp</option>
                          <option value="update_status">Update Status</option>
                        </select>
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium">Details</label>
                        <textarea
                          value={selectedBlockData.config.details || ''}
                          onChange={(e) => handleBlockConfigUpdate({ ...selectedBlockData.config, details: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                          rows={3}
                          placeholder="Action details..."
                        />
                      </div>
                    </div>
                  )}

                  {/* Delay Block Config */}
                  {selectedBlockData.type === 'delay' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block mb-2 text-sm font-medium">Duration</label>
                        <input
                          type="number"
                          value={selectedBlockData.config.duration || ''}
                          onChange={(e) => handleBlockConfigUpdate({ ...selectedBlockData.config, duration: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="Enter duration..."
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium">Unit</label>
                        <select
                          value={selectedBlockData.config.unit || 'minutes'}
                          onChange={(e) => handleBlockConfigUpdate({ ...selectedBlockData.config, unit: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="seconds">Seconds</option>
                          <option value="minutes">Minutes</option>
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleBlockDelete(selectedBlock)}
                  className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                >
                  Delete Block
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
