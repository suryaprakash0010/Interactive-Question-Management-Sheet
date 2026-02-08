import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Trash2, Edit, Check, X } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import EditableText from '../common/EditableText';
import { getDifficultyColor, getStatusColor, formatDate, cn } from '../../utils/helpers';
import { useQuestionStore } from '../../store/questionStore';

const QuestionCard = ({ question, subTopicId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: question.title,
    description: question.description,
    difficulty: question.difficulty,
    status: question.status,
    tags: question.tags?.join(', ') || ''
  });
  
  const { updateQuestion, deleteQuestion } = useQuestionStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: question.id,
    data: {
      type: 'question',
      subTopicId
    }
  });
  
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  };
  
  const handleUpdate = async (field, value) => {
    try {
      await updateQuestion(question.id, { [field]: value });
    } catch (error) {
      console.error('Failed to update question:', error);
    }
  };
  
  const handleSaveEdit = async () => {
    try {
      await updateQuestion(question.id, {
        ...editForm,
        tags: editForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update question:', error);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteQuestion(question.id);
      } catch (error) {
        console.error('Failed to delete question:', error);
      }
    }
  };
  
  if (isEditing) {
    return (
      <div className="bg-card/80 border border-border/60 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Edit Question</h4>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSaveEdit}>
              <Check className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <input
          value={editForm.title}
          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
          className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm bg-background/60 focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Question title"
        />
        
        <textarea
          value={editForm.description}
          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
          className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm bg-background/60 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          rows={2}
          placeholder="Description (optional)"
        />
        
        <div className="flex gap-2">
          <select
            value={editForm.difficulty}
            onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })}
            className="px-3 py-2 border border-border/60 rounded-lg text-sm bg-background/60 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          
          <select
            value={editForm.status}
            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
            className="px-3 py-2 border border-border/60 rounded-lg text-sm bg-background/60 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="Todo">Todo</option>
            <option value="Done">Done</option>
            <option value="Revising">Revising</option>
          </select>
        </div>
        
        <input
          value={editForm.tags}
          onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
          className="w-full px-3 py-2 border border-border/60 rounded-lg text-sm bg-background/60 focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Tags (comma separated)"
        />
      </div>
    );
  }
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-card/80 border border-border/60 rounded-xl p-3 hover:shadow-md transition-shadow cursor-move group',
        isDragging && 'opacity-50'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="h-4 w-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"/>
              </svg>
            </div>
            
            <EditableText
              value={question.title}
              onChange={(value) => handleUpdate('title', value)}
              className="font-medium text-sm flex-1"
            />
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <Badge className={cn('text-xs', getDifficultyColor(question.difficulty))}>
              {question.difficulty}
            </Badge>
            <Badge className={cn('text-xs', getStatusColor(question.status))}>
              {question.status}
            </Badge>
          </div>
          
          {question.description && (
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {question.description}
            </p>
          )}
          
          {question.tags && question.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {question.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="text-xs text-muted-foreground">
            Updated {formatDate(question.updatedAt)}
          </div>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="h-6 w-6"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleDelete}
            className="h-6 w-6 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
