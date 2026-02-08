import React from 'react';
import { useQuestionStore } from '../../store/questionStore';

const StatisticsDashboard = () => {
  const { topics, subTopics, questions } = useQuestionStore();
  
  const totalTopics = Object.keys(topics).length;
  const totalSubTopics = Object.keys(subTopics).length;
  const totalQuestions = Object.keys(questions).length;
  
  const questionsByStatus = {
    Todo: Object.values(questions).filter(q => q.status === 'Todo').length,
    Done: Object.values(questions).filter(q => q.status === 'Done').length,
    Revising: Object.values(questions).filter(q => q.status === 'Revising').length,
  };
  
  const questionsByDifficulty = {
    Easy: Object.values(questions).filter(q => q.difficulty === 'Easy').length,
    Medium: Object.values(questions).filter(q => q.difficulty === 'Medium').length,
    Hard: Object.values(questions).filter(q => q.difficulty === 'Hard').length,
  };
  
  const completionRate = totalQuestions > 0 
    ? Math.round((questionsByStatus.Done / totalQuestions) * 100) 
    : 0;

  return (
    <div className="bg-card rounded-lg border p-4 space-y-4">
      <h3 className="font-semibold text-lg text-foreground">Statistics</h3>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-muted/50 rounded p-2">
          <div className="text-2xl font-bold text-primary">{totalTopics}</div>
          <div className="text-xs text-muted-foreground">Topics</div>
        </div>
        <div className="bg-muted/50 rounded p-2">
          <div className="text-2xl font-bold text-secondary-foreground">{totalSubTopics}</div>
          <div className="text-xs text-muted-foreground">SubTopics</div>
        </div>
        <div className="bg-muted/50 rounded p-2">
          <div className="text-2xl font-bold text-accent-foreground">{totalQuestions}</div>
          <div className="text-xs text-muted-foreground">Questions</div>
        </div>
      </div>
      
      {/* Progress Overview */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Overall Progress</span>
          <span className="font-medium">{completionRate}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>
      
      {/* Status Breakdown */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">By Status</h4>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-green-600">✓ Done</span>
            <span className="font-medium">{questionsByStatus.Done}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-blue-600">↻ Revising</span>
            <span className="font-medium">{questionsByStatus.Revising}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">○ Todo</span>
            <span className="font-medium">{questionsByStatus.Todo}</span>
          </div>
        </div>
      </div>
      
      {/* Difficulty Breakdown */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">By Difficulty</h4>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-green-600">Easy</span>
            <span className="font-medium">{questionsByDifficulty.Easy}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-yellow-600">Medium</span>
            <span className="font-medium">{questionsByDifficulty.Medium}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-red-600">Hard</span>
            <span className="font-medium">{questionsByDifficulty.Hard}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDashboard;
