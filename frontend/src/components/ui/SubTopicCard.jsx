import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import Button from '../common/Button';
import EditableText from '../common/EditableText';
import DraggableQuestionCard from './DraggableQuestionCard';
import AddQuestionForm from './AddQuestionForm';
import { useQuestionStore } from '../../store/questionStore';
import { cn } from '../../utils/helpers';

const SubTopicCard = ({ subTopic, topicId, questions }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  
  const { updateSubTopic, deleteSubTopic, questionOrder } = useQuestionStore();
  
  const { setNodeRef, isOver } = useDroppable({
    id: subTopic.id,
    data: {
      type: 'subtopic',
      topicId
    }
  });
  
  const subTopicQuestions = questions.filter(q => q.subTopicId === subTopic.id);
  const orderedQuestions = (questionOrder[subTopic.id] || [])
    .map(id => subTopicQuestions.find(q => q.id === id))
    .filter(Boolean);
  
  const handleUpdate = async (field, value) => {
    try {
      await updateSubTopic(subTopic.id, { [field]: value });
    } catch (error) {
      console.error('Failed to update subtopic:', error);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this subtopic and all its questions?')) {
      try {
        await deleteSubTopic(subTopic.id);
      } catch (error) {
        console.error('Failed to delete subtopic:', error);
      }
    }
  };
  
  const completedQuestions = subTopicQuestions.filter(q => q.status === 'Done').length;
  const totalQuestions = subTopicQuestions.length;
  const progress = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;
  
  return (
    <div className="bg-background/60 border border-border/60 rounded-xl overflow-hidden shadow-sm hover:shadow transition-shadow">
      <div className="p-3 bg-muted/30 border-b border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            
            <EditableText
              value={subTopic.title}
              onChange={(value) => handleUpdate('title', value)}
              className="font-medium text-sm flex-1 tracking-tight"
            />
            
            {totalQuestions > 0 && (
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground">
                  {completedQuestions}/{totalQuestions}
                </div>
                <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowAddQuestion(true)}
              className="h-6 w-6"
              title="Add Question"
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDelete}
              className="h-6 w-6 text-destructive hover:text-destructive"
              title="Delete SubTopic"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {subTopic.description && (
          <EditableText
            value={subTopic.description}
            onChange={(value) => handleUpdate('description', value)}
            placeholder="Add description..."
            className="text-xs text-muted-foreground mt-1"
          />
        )}
      </div>
      
      {isExpanded && (
        <div
          ref={setNodeRef}
          className={cn(
            'p-3 min-h-[50px] transition-colors',
            isOver && 'bg-accent/50'
          )}
        >
          {showAddQuestion && (
            <AddQuestionForm
              subTopicId={subTopic.id}
              onCancel={() => setShowAddQuestion(false)}
              onSuccess={() => setShowAddQuestion(false)}
            />
          )}
          
          {orderedQuestions.length > 0 ? (
            <SortableContext
              items={orderedQuestions.map(q => q.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {orderedQuestions.map((question) => (
                  <DraggableQuestionCard
                    key={question.id}
                    question={question}
                    subTopicId={subTopic.id}
                  />
                ))}
              </div>
            </SortableContext>
          ) : (
            !showAddQuestion && (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-3">
                  No questions yet
                </p>
                <Button
                  size="sm"
                  onClick={() => setShowAddQuestion(true)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Question
                </Button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SubTopicCard;
