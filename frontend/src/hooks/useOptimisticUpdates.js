import { useState, useCallback } from 'react';
import { useQuestionStore } from '../store/questionStore';

export const useOptimisticUpdates = () => {
  const [optimisticUpdates, setOptimisticUpdates] = useState({});
  const { updateQuestion, updateSubTopic, updateTopic } = useQuestionStore();
  
  const optimisticUpdate = useCallback(async (type, id, updates) => {
    const updateKey = `${type}-${id}`;
    const previousData = useQuestionStore.getState()[type][id];
    
    // Apply optimistic update immediately
    setOptimisticUpdates(prev => ({
      ...prev,
      [updateKey]: { previousData, updates }
    }));
    
    try {
      // Apply the actual update
      if (type === 'questions') {
        await updateQuestion(id, updates);
      } else if (type === 'subTopics') {
        await updateSubTopic(id, updates);
      } else if (type === 'topics') {
        await updateTopic(id, updates);
      }
      
      // Clear optimistic update on success
      setOptimisticUpdates(prev => {
        const newUpdates = { ...prev };
        delete newUpdates[updateKey];
        return newUpdates;
      });
    } catch (error) {
      // Revert on error
      console.error('Optimistic update failed:', error);
      
      // Revert the change in the store
      if (type === 'questions') {
        await updateQuestion(id, previousData);
      } else if (type === 'subTopics') {
        await updateSubTopic(id, previousData);
      } else if (type === 'topics') {
        await updateTopic(id, previousData);
      }
      
      // Clear optimistic update
      setOptimisticUpdates(prev => {
        const newUpdates = { ...prev };
        delete newUpdates[updateKey];
        return newUpdates;
      });
    }
  }, [updateQuestion, updateSubTopic, updateTopic]);
  
  return { optimisticUpdate, optimisticUpdates };
};

export default useOptimisticUpdates;
