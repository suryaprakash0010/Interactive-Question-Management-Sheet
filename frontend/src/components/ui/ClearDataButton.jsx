import React, { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';
import { useQuestionStore } from '../../store/questionStore';

const ClearDataButton = () => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const { clearAllData } = useQuestionStore();

  const handleClear = async () => {
    try {
      setIsClearing(true);
      await clearAllData();
      setIsConfirming(false);
      alert('All data has been cleared successfully!');
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('Failed to clear data. Please try again.');
    } finally {
      setIsClearing(false);
    }
  };

  if (isConfirming) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 space-y-2">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-destructive mb-1">Clear All Data?</p>
            <p className="text-muted-foreground mb-2">
              This will permanently delete all topics, subtopics, and questions. This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={handleClear}
                disabled={isClearing}
              >
                {isClearing ? 'Clearing...' : 'Yes, Clear All'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsConfirming(false)}
                disabled={isClearing}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setIsConfirming(true)}
      className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
    >
      <Trash2 className="h-4 w-4 mr-2" />
      Clear All Data
    </Button>
  );
};

export default ClearDataButton;
