import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { COLORS } from '../../utils/helpers';
import { useQuestionStore } from '../../store/questionStore';

const AddTopicForm = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    color: COLORS[0]
  });
  const [loading, setLoading] = useState(false);
  
  const { addTopic } = useQuestionStore();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await addTopic(formData);
      
      setFormData({
        title: '',
        description: '',
        color: COLORS[0]
      });
      
      onSuccess?.();
    } catch (error) {
      console.error('Failed to add topic:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <div className="bg-card border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Create New Topic</h3>
        <Button
          size="icon"
          variant="ghost"
          onClick={onCancel}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Topic title *"
            required
            autoFocus
          />
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Color:</label>
            <div className="flex gap-2">
              {COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleChange('color', color)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    formData.color === color ? 'border-gray-900 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
        
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Description (optional)"
          className="w-full px-3 py-2 border border-input rounded-md text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
          rows={3}
        />
        
        <div className="flex gap-2">
          <Button type="submit" disabled={loading} loading={loading}>
            Create Topic
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTopicForm;
