import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import QuestionCard from './QuestionCard';

const DraggableQuestionCard = ({ question, subTopicId }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        className="absolute left-2 top-3 z-10 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-3 w-3 text-muted-foreground hover:text-foreground" />
      </div>
      <div className="ml-5">
        <QuestionCard question={question} subTopicId={subTopicId} />
      </div>
    </div>
  );
};

export default DraggableQuestionCard;
