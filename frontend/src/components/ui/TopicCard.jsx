import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import Button from '../common/Button';
import EditableText from '../common/EditableText';
import DraggableSubTopicCard from './DraggableSubTopicCard';
import AddSubTopicForm from './AddSubTopicForm';
import { useQuestionStore } from '../../store/questionStore';
import { cn } from '../../utils/helpers';

const TopicCard = ({ topic, subTopics, questions }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddSubTopic, setShowAddSubTopic] = useState(false);
  
  const { updateTopic, deleteTopic, subTopicOrder } = useQuestionStore();
  
  const { setNodeRef, isOver } = useDroppable({
    id: topic.id,
    data: {
      type: 'topic'
    }
  });
  
  const topicSubTopics = subTopics.filter(st => st.topicId === topic.id);
  const orderedSubTopics = (subTopicOrder[topic.id] || [])
    .map(id => topicSubTopics.find(st => st.id === id))
    .filter(Boolean);
  
  const handleUpdate = async (field, value) => {
    try {
      await updateTopic(topic.id, { [field]: value });
    } catch (error) {
      console.error('Failed to update topic:', error);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this topic and all its subtopics and questions?')) {
      try {
        await deleteTopic(topic.id);
      } catch (error) {
        console.error('Failed to delete topic:', error);
      }
    }
  };
  
  // Calculate progress for this topic
  const topicQuestions = questions.filter(q => {
    const subTopic = subTopics.find(st => st.id === q.subTopicId);
    return subTopic?.topicId === topic.id;
  });
  
  const completedQuestions = topicQuestions.filter(q => q.status === 'Done').length;
  const totalQuestions = topicQuestions.length;
  const progress = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;
  
  return (
    <div className="bg-card/80 border border-border/60 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div 
        className="p-4 border-b border-border/60"
        style={{ backgroundColor: `${topic.color}10` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: topic.color }}
            />
            
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
            
            <div className="flex-1 min-w-0">
              <EditableText
                value={topic.title}
                onChange={(value) => handleUpdate('title', value)}
                className="font-semibold text-base tracking-tight"
              />
              
              <EditableText
                value={topic.description}
                onChange={(value) => handleUpdate('description', value)}
                placeholder="Add description..."
                className="text-sm text-muted-foreground mt-1"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {totalQuestions > 0 && (
              <div className="flex items-center gap-2 mr-2">
                <div className="text-sm text-muted-foreground">
                  {completedQuestions}/{totalQuestions}
                </div>
                <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {progress}%
                </span>
              </div>
            )}
            
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowAddSubTopic(true)}
              className="h-8 w-8"
              title="Add SubTopic"
            >
              <Plus className="h-4 w-4" />
            </Button>
            
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDelete}
              className="h-8 w-8 text-destructive hover:text-destructive"
              title="Delete Topic"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div
          ref={setNodeRef}
          className={cn(
            'p-4 min-h-[100px] transition-colors',
            isOver && 'bg-accent/50'
          )}
        >
          {showAddSubTopic && (
            <AddSubTopicForm
              topicId={topic.id}
              onCancel={() => setShowAddSubTopic(false)}
              onSuccess={() => setShowAddSubTopic(false)}
            />
          )}
          
          {orderedSubTopics.length > 0 ? (
            <SortableContext
              items={orderedSubTopics.map(st => st.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {orderedSubTopics.map((subTopic) => (
                  <DraggableSubTopicCard
                    key={subTopic.id}
                    subTopic={subTopic}
                    topicId={topic.id}
                    questions={questions}
                  />
                ))}
              </div>
            </SortableContext>
          ) : (
            !showAddSubTopic && (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <svg className="h-12 w-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="text-lg font-medium mb-1">No subtopics yet</p>
                  <p className="text-sm">Create your first subtopic to start organizing questions</p>
                </div>
                <Button onClick={() => setShowAddSubTopic(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add SubTopic
                </Button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default TopicCard;
