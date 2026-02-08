import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { useQuestionStore } from '../../store/questionStore';

const AddSubTopicForm = ({ topicId, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { addSubTopic } = useQuestionStore();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await addSubTopic({
        ...formData,
        topicId
      });
      
      setFormData({
        title: '',
        description: ''
      });
      
      onSuccess?.();
    } catch (error) {
      console.error('Failed to add subtopic:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <div className="bg-card border rounded-lg p-4 mb-3">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium">Add New SubTopic</h4>
        <Button
          size="icon"
          variant="ghost"
          onClick={onCancel}
          className="h-6 w-6"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="SubTopic title *"
          required
          autoFocus
        />
        
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Description (optional)"
          className="w-full px-3 py-2 border border-input rounded-md text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
          rows={2}
        />
        
        <div className="flex gap-2">
          <Button type="submit" disabled={loading} loading={loading}>
            Add SubTopic
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddSubTopicForm;
