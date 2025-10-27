import React from 'react';
import DragDropTemplateEditor from './DragDropTemplateEditor-Complete';

interface VisualTemplateEditorProps {
  onSave: (template: any) => void;
  onCancel: () => void;
  initialTemplate?: any;
}

const VisualTemplateEditor: React.FC<VisualTemplateEditorProps> = ({ 
  onSave, 
  onCancel, 
  initialTemplate 
}) => {
  return (
    <DragDropTemplateEditor
      onSave={onSave}
      onCancel={onCancel}
      initialTemplate={initialTemplate}
    />
  );
};

export default VisualTemplateEditor;
