import { useCallback, useRef } from 'react';
import { useQuestionStore } from '../store/questionStore';

export const useUndoRedo = () => {
  const { 
    topics, 
    subTopics, 
    questions, 
    topicOrder, 
    subTopicOrder, 
    questionOrder 
  } = useQuestionStore();
  
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);
  const maxHistorySize = 50;
  
  const saveState = useCallback(() => {
    const state = {
      topics: { ...topics },
      subTopics: { ...subTopics },
      questions: { ...questions },
      topicOrder: [...topicOrder],
      subTopicOrder: { ...subTopicOrder },
      questionOrder: { ...questionOrder }
    };
    
    // Remove any states after current index
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    
    // Add new state
    historyRef.current.push(state);
    historyIndexRef.current++;
    
    // Limit history size
    if (historyRef.current.length > maxHistorySize) {
      historyRef.current.shift();
      historyIndexRef.current--;
    }
  }, [topics, subTopics, questions, topicOrder, subTopicOrder, questionOrder]);
  
  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      const previousState = historyRef.current[historyIndexRef.current];
      
      // Restore state (this would need to be implemented in the store)
      console.log('Undo to state:', previousState);
      return previousState;
    }
    return null;
  }, []);
  
  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      const nextState = historyRef.current[historyIndexRef.current];
      
      // Restore state (this would need to be implemented in the store)
      console.log('Redo to state:', nextState);
      return nextState;
    }
    return null;
  }, []);
  
  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;
  
  return {
    saveState,
    undo,
    redo,
    canUndo,
    canRedo,
    historySize: historyRef.current.length,
    currentIndex: historyIndexRef.current
  };
};

export default useUndoRedo;
