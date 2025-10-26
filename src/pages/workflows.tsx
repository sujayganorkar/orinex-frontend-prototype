import React, { useState } from 'react';
import Layout from '@/components/Layout';
import WorkflowBuilder from '@/components/WorkflowBuilder';
import WorkflowExecutor from '@/components/WorkflowExecutor';

const Workflows: React.FC = () => {
  const [workflows, setWorkflows] = useState([
    { id: 'wf1', name: 'Standard Quotation Flow', blocks: [
      { id: 'b1', type: 'template', x: 100, y: 100, config: { name: 'Standard Quotation', format: 'docx' }},
      { id: 'b2', type: 'action', x: 100, y: 200, config: { actionType: 'send_email' }}
    ], lastRun: '2024-03-10', status: 'active' },
    { id: 'wf2', name: 'Invoice Generation', blocks: [], lastRun: '2024-03-09', status: 'draft' }
  ]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showExecutor, setShowExecutor] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);

  const handleSaveWorkflow = (workflow: any) => {
    if (selectedWorkflow) {
      setWorkflows(workflows.map(w => w.id === workflow.id ? workflow : w));
    } else {
      setWorkflows([...workflows, workflow]);
    }
    setShowBuilder(false);
    setSelectedWorkflow(null);
  };

  const handleExecuteWorkflow = (workflow: any) => {
    setSelectedWorkflow(workflow);
    setShowExecutor(true);
  };

  const handleExecutionComplete = (result: any) => {
    console.log('Execution complete:', result);
    setShowExecutor(false);
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Workflow Management</h1>
          <button 
            onClick={() => { setSelectedWorkflow(null); setShowBuilder(true); }}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            + Create Workflow
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map(workflow => (
            <div key={workflow.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">{workflow.name}</h3>
                  <p className="text-sm text-gray-500">{workflow.blocks.length} blocks</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  workflow.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {workflow.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {workflow.blocks.slice(0, 3).map((block: any) => (
                  <div key={block.id} className="flex items-center gap-2 text-sm">
                    <span>{block.type === 'template' ? '📄' : block.type === 'action' ? '⚡' : '🔀'}</span>
                    <span className="text-gray-600">{block.config.name || block.type}</span>
                  </div>
                ))}
                {workflow.blocks.length > 3 && (
                  <div className="text-sm text-gray-400">+{workflow.blocks.length - 3} more</div>
                )}
              </div>

              <div className="text-xs text-gray-500 mb-4">
                Last run: {workflow.lastRun}
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => { setSelectedWorkflow(workflow); setShowBuilder(true); }}
                  className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleExecuteWorkflow(workflow)}
                  className="flex-1 px-3 py-2 bg-primary text-white rounded-md hover:bg-primary-dark text-sm"
                >
                  Execute
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showBuilder && (
        <WorkflowBuilder
          onSave={handleSaveWorkflow}
          onCancel={() => { setShowBuilder(false); setSelectedWorkflow(null); }}
          initialWorkflow={selectedWorkflow}
        />
      )}

      {showExecutor && selectedWorkflow && (
        <WorkflowExecutor
          workflow={selectedWorkflow}
          orderData={{}}
          onComplete={handleExecutionComplete}
          onCancel={() => setShowExecutor(false)}
        />
      )}
    </Layout>
  );
};

export default Workflows;
