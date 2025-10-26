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
        addLog(`Generating template: ${block.config.name}`);
        const templateResult = {
          type: 'template',
          name: block.config.name,
          format: block.config.format,
          generated: true
        };
        return templateResult;

      case 'condition':
        addLog(`Evaluating condition: ${block.config.condition}`);
        const conditionMet = true; // Simulate condition evaluation
        addLog(`Condition result: ${conditionMet ? 'TRUE' : 'FALSE'}`);
        return { type: 'condition', met: conditionMet };

      case 'action':
        addLog(`Performing action: ${block.config.actionType}`);
        return { type: 'action', actionType: block.config.actionType, completed: true };

      case 'delay':
        addLog(`Waiting for ${block.config.duration} ${block.config.unit}`);
        return { type: 'delay', duration: block.config.duration, unit: block.config.unit };

      default:
        return { type: 'unknown', completed: false };
    }
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    setExecutionLog([]);
    setResults([]);
    setCurrentStep(0);

    addLog(`Starting workflow: ${workflow.name}`);
    addLog(`Processing order: ${orderData?.id || 'N/A'}`);

    const blockResults = [];

    for (let i = 0; i < workflow.blocks.length; i++) {
      setCurrentStep(i + 1);
      const block = workflow.blocks[i];
      
      try {
        const result = await executeBlock(block);
        blockResults.push(result);
        addLog(`✓ Block completed successfully`);
      } catch (error) {
        addLog(`✗ Block failed: ${error}`);
        break;
      }
    }

    setResults(blockResults);
    addLog(`Workflow execution completed`);
    setIsExecuting(false);
  };

  const handleFinish = () => {
    onComplete({
      workflowId: workflow.id,
      executedAt: new Date().toISOString(),
      results,
      log: executionLog
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
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

          {/* Execution Status */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Workflow</div>
              <div className="font-semibold">{workflow?.name}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Status</div>
              <div className="font-semibold">
                {isExecuting ? '⏳ Executing...' : currentStep > 0 ? '✓ Completed' : '⏸️ Ready'}
              </div>
            </div>
          </div>

          {/* Execution Log */}
          <div className="bg-gray-900 text-green-400 rounded-lg p-4 h-64 overflow-auto font-mono text-sm">
            {executionLog.length === 0 && (
              <div className="text-gray-500">Click "Start Execution" to begin...</div>
            )}
            {executionLog.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>

          {/* Results Preview */}
          {results.length > 0 && (
            <div className="mt-6">
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
            {currentStep > 0 ? 'Close' : 'Cancel'}
          </button>
          <div className="flex gap-2">
            {!isExecuting && currentStep === 0 && (
              <button
                onClick={handleExecute}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Start Execution
              </button>
            )}
            {!isExecuting && currentStep > 0 && (
              <button
                onClick={handleFinish}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Finish & Save Results
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowExecutor;
