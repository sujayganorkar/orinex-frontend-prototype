import React, { useState } from 'react';
import ProgressBar from './ProgressBar';

interface WorkflowExecutorProps {
  workflow: any;
  orderData: any;
  onComplete: (result: any) => void;
  onCancel: () => void;
}

const WorkflowExecutor: React.FC<WorkflowExecutorProps> = ({ 
  workflow, 
  orderData, 
  onComplete, 
  onCancel 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLog, setExecutionLog] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [awaitingApproval, setAwaitingApproval] = useState(false);
  const [pendingBlock, setPendingBlock] = useState<any>(null);
  const [isWorkflowComplete, setIsWorkflowComplete] = useState(false);

  const totalSteps = workflow?.blocks?.length || 0;
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  const addLog = (message: string) => {
    setExecutionLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const executeBlock = async (block: any) => {
    addLog(`Executing ${block.type} block: ${block.config.name || 'Unnamed'}`);
    
    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    switch (block.type) {
      case 'template':
        addLog(`✓ Generated template: ${block.config.name}`);
        return {
          type: 'template',
          name: block.config.name,
          format: block.config.format,
          generated: true
        };

      case 'condition':
        addLog(`Evaluating condition: ${block.config.condition}`);
        const conditionMet = true; // Simulate condition evaluation
        addLog(`✓ Condition result: ${conditionMet ? 'TRUE' : 'FALSE'}`);
        return { type: 'condition', met: conditionMet };

      case 'action':
        addLog(`✓ Performed action: ${block.config.actionType}`);
        return { type: 'action', actionType: block.config.actionType, completed: true };

      case 'delay':
        addLog(`✓ Waited for ${block.config.duration} ${block.config.unit}`);
        return { type: 'delay', duration: block.config.duration, unit: block.config.unit };

      default:
        return { type: 'unknown', completed: false };
    }
  };

  const getBlockIcon = (type: string) => {
    switch(type) {
      case 'template': return '📄';
      case 'condition': return '🔀';
      case 'action': return '⚡';
      case 'delay': return '⏱️';
      default: return '📦';
    }
  };

  const getBlockDescription = (block: any) => {
    switch(block.type) {
      case 'template': return `Generate ${block.config.name} document (${block.config.format})`;
      case 'condition': return `Check condition: ${block.config.condition}`;
      case 'action': return `${block.config.actionType}: ${block.config.details || 'No details'}`;
      case 'delay': return `Wait ${block.config.duration} ${block.config.unit}`;
      default: return 'Unknown action';
    }
  };

  const handleStartExecution = () => {
    if (workflow.blocks.length === 0) return;
    
    setIsExecuting(true);
    setExecutionLog([]);
    setResults([]);
    setCurrentStep(0);
    setAwaitingApproval(true);
    setPendingBlock(workflow.blocks[0]);
    
    addLog(`🚀 Starting workflow: ${workflow.name}`);
    addLog(`📦 Processing order: ${orderData?.id || 'N/A'}`);
    addLog(`⏸️ Awaiting approval for step 1...`);
  };

  const handleApproveStep = async () => {
    if (!pendingBlock) return;
    
    setAwaitingApproval(false);
    setIsExecuting(true);
    
    addLog(`✅ Step ${currentStep + 1} approved - executing...`);
    
    try {
      const result = await executeBlock(pendingBlock);
      setResults(prev => [...prev, result]);
      
      const nextStepIndex = currentStep + 1;
      
      if (nextStepIndex >= workflow.blocks.length) {
        // Workflow complete
        setCurrentStep(nextStepIndex);
        setIsWorkflowComplete(true);
        setIsExecuting(false);
        addLog(`🎉 Workflow execution completed successfully`);
      } else {
        // Move to next step
        setCurrentStep(nextStepIndex);
        setPendingBlock(workflow.blocks[nextStepIndex]);
        setAwaitingApproval(true);
        setIsExecuting(false);
        addLog(`⏸️ Awaiting approval for step ${nextStepIndex + 1}...`);
      }
    } catch (error) {
      addLog(`❌ Step failed: ${error}`);
      setIsExecuting(false);
      setAwaitingApproval(false);
    }
  };

  const handleRejectStep = () => {
    addLog(`❌ Step ${currentStep + 1} rejected - workflow paused`);
    setAwaitingApproval(false);
    setIsExecuting(false);
  };

  const handleFinish = () => {
    onComplete({
      workflowId: workflow.id,
      executedAt: new Date().toISOString(),
      results,
      log: executionLog,
      stepsCompleted: currentStep
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold mb-2">Workflow Execution</h2>
          <p className="text-gray-600">{workflow?.name || 'Unnamed Workflow'}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Progress */}
          <div className="mb-6">
            <ProgressBar 
              progress={progress} 
              label={`Step ${currentStep} of ${totalSteps}`}
              color="primary"
            />
          </div>

          {/* Current Step Preview */}
          {awaitingApproval && pendingBlock && (
            <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{getBlockIcon(pendingBlock.type)}</span>
                <div>
                  <h3 className="font-bold text-lg">Step {currentStep + 1}: Awaiting Approval</h3>
                  <p className="text-gray-700">{getBlockDescription(pendingBlock)}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleApproveStep}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold"
                >
                  ✅ Approve & Execute
                </button>
                <button
                  onClick={handleRejectStep}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold"
                >
                  ❌ Reject Step
                </button>
              </div>
            </div>
          )}

          {/* Execution Status */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Workflow</div>
              <div className="font-semibold">{workflow?.name}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Status</div>
              <div className="font-semibold">
                {isExecuting && '⏳ Executing...'}
                {awaitingApproval && '⏸️ Awaiting Approval'}
                {isWorkflowComplete && '✅ Completed'}
                {!isExecuting && !awaitingApproval && !isWorkflowComplete && '⏸️ Ready'}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Progress</div>
              <div className="font-semibold">{currentStep}/{totalSteps} Steps</div>
            </div>
          </div>

          {/* Workflow Steps Overview */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Workflow Steps</h3>
            <div className="space-y-2">
              {workflow.blocks.map((block: any, index: number) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border-2 flex items-center gap-3 ${
                    index < currentStep 
                      ? 'bg-green-50 border-green-200' 
                      : index === currentStep && awaitingApproval
                      ? 'bg-yellow-50 border-yellow-300 ring-2 ring-yellow-400'
                      : index === currentStep && isExecuting
                      ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <span className="text-2xl">{getBlockIcon(block.type)}</span>
                  <div className="flex-1">
                    <div className="font-medium">Step {index + 1}: {block.config.name || 'Unnamed'}</div>
                    <div className="text-sm text-gray-600">{getBlockDescription(block)}</div>
                  </div>
                  <div className="text-right">
                    {index < currentStep && <span className="text-green-600 font-bold">✓</span>}
                    {index === currentStep && awaitingApproval && <span className="text-yellow-600 font-bold">⏸️</span>}
                    {index === currentStep && isExecuting && <span className="text-blue-600 font-bold">⏳</span>}
                    {index > currentStep && <span className="text-gray-400 font-bold">○</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Execution Log */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Execution Log</h3>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 h-48 overflow-auto font-mono text-sm">
              {executionLog.length === 0 && (
                <div className="text-gray-500">Click "Start Execution" to begin...</div>
              )}
              {executionLog.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </div>
          </div>

          {/* Results Preview */}
          {results.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Execution Results</h3>
              <div className="space-y-2">
                {results.map((result, index) => (
                  <div key={index} className="bg-white border rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {result.type === 'template' && '📄'}
                        {result.type === 'condition' && '🔀'}
                        {result.type === 'action' && '⚡'}
                        {result.type === 'delay' && '⏱️'}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium capitalize">{result.type}</div>
                        <div className="text-sm text-gray-600">
                          {JSON.stringify(result, null, 2).slice(0, 100)}...
                        </div>
                      </div>
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-between">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            disabled={isExecuting}
          >
            {isWorkflowComplete ? 'Close' : 'Cancel'}
          </button>
          <div className="flex gap-2">
            {!isExecuting && !awaitingApproval && !isWorkflowComplete && currentStep === 0 && (
              <button
                onClick={handleStartExecution}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                🚀 Start Execution
              </button>
            )}
            {isWorkflowComplete && (
              <button
                onClick={handleFinish}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                ✅ Finish & Save Results
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowExecutor;
