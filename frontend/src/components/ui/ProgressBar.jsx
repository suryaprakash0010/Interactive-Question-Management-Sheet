import React from 'react';
import { CheckCircle, Circle, RotateCcw } from 'lucide-react';
import { useQuestionStore } from '../../store/questionStore';

const ProgressBar = () => {
  const progress = useQuestionStore(state => state.getProgress());
  
  const { total, completed, todo, revising, completionRate } = progress;
  
  const statusItems = [
    { label: 'Done', count: completed, color: 'text-green-600 bg-green-50', icon: CheckCircle },
    { label: 'Todo', count: todo, color: 'text-blue-600 bg-blue-50', icon: Circle },
    { label: 'Revising', count: revising, color: 'text-orange-600 bg-orange-50', icon: RotateCcw },
  ];
  
  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Overall Progress</h3>
        <div className="text-2xl font-bold text-primary">
          {completionRate}%
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>{completed} of {total} questions completed</span>
          <span>{completionRate}%</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 ease-out"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {statusItems.map(({ label, count, color, icon: Icon }) => (
          <div key={label} className="text-center">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${color} mb-2`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-lg font-semibold">{count}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
