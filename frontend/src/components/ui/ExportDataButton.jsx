import React, { useState } from 'react';
import { Download, FileDown } from 'lucide-react';
import Button from '../common/Button';
import { useQuestionStore } from '../../store/questionStore';

const ExportDataButton = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { topics, subTopics, questions } = useQuestionStore();

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // Prepare data for export
      const exportData = {
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
        data: {
          topics: Object.values(topics),
          subTopics: Object.values(subTopics),
          questions: Object.values(questions)
        },
        statistics: {
          totalTopics: Object.keys(topics).length,
          totalSubTopics: Object.keys(subTopics).length,
          totalQuestions: Object.keys(questions).length,
          completedQuestions: Object.values(questions).filter(q => q.status === 'Done').length,
          completionRate: Object.keys(questions).length > 0 
            ? Math.round((Object.values(questions).filter(q => q.status === 'Done').length / Object.keys(questions).length) * 100)
            : 0
        }
      };
      
      // Create and download JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `question-management-sheet-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isExporting}
      className="w-full"
    >
      {isExporting ? (
        <>
          <FileDown className="h-4 w-4 mr-2 animate-pulse" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </>
      )}
    </Button>
  );
};

export default ExportDataButton;
