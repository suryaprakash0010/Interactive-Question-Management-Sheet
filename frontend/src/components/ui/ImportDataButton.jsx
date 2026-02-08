import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import Button from '../common/Button';
import { useQuestionStore } from '../../store/questionStore';
import { api } from '../../utils/api';

const ImportDataButton = () => {
  const [isImporting, setIsImporting] = useState(false);
  const { 
    fetchTopics, 
    addTopic, 
    addSubTopic, 
    addQuestion,
    clearAllData 
  } = useQuestionStore();

  const transformExternalData = async (externalData) => {
    try {
      // Clear existing data first
      await clearAllData();

      const sheet = externalData?.data?.sheet || externalData?.sheet;
      if (!sheet) {
        throw new Error('Invalid external payload: missing sheet');
      }

      const topics = Array.isArray(sheet.topics) ? sheet.topics : [];
      const subTopics = Array.isArray(sheet.subTopics) ? sheet.subTopics : [];
      const questions = Array.isArray(sheet.questions) ? sheet.questions : [];
      
      // Create topics
      const topicMap = {};
      for (let i = 0; i < topics.length; i++) {
        const topic = topics[i];
        const title = (topic?.name ?? topic?.title ?? `Topic ${i + 1}`).toString();
        const newTopic = await addTopic({
          title,
          description: (topic?.description ?? `Topic for ${title}`).toString(),
          color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][i % 5]
        });

        topicMap[topic?._id] = newTopic?._id;
      }
      
      // Create subtopics
      const subTopicMap = {};
      for (const subTopic of subTopics) {
        const parentTopicId = topicMap[subTopic?.topicId];
        if (parentTopicId) {
          const title = (subTopic?.name ?? subTopic?.title ?? 'Subtopic').toString();
          const newSubTopic = await addSubTopic({
            title,
            description: (subTopic?.description ?? `SubTopic for ${title}`).toString(),
            topicId: parentTopicId
          });
          subTopicMap[subTopic?._id] = newSubTopic?._id;
        }
      }
      
      // Create questions
      let importedCount = 0;
      for (const question of questions) {
        const parentSubTopicId = subTopicMap[question?.subTopicId];
        if (parentSubTopicId) {
          const title = (question?.name ?? question?.title ?? 'Question').toString();
          const difficulty = (question?.difficulty ?? 'Medium').toString();
          const tags = Array.isArray(question?.tags) ? question.tags : [];

          await addQuestion({
            title,
            description: (question?.problemStatement ?? question?.description ?? '').toString(),
            subTopicId: parentSubTopicId,
            difficulty,
            status: question?.isCompleted ? 'Done' : 'Todo',
            tags
          });
          importedCount++;
        }
      }
      
      return {
        topicsImported: topics.length,
        subTopicsImported: subTopics.length,
        questionsImported: importedCount
      };
    } catch (error) {
      console.error('Error transforming data:', error);
      throw error;
    }
  };

  const handleImport = async () => {
    try {
      setIsImporting(true);
      
      // Fetch data from external API
      const response = await api.get('/external/fetch-sheet');
      
      if (response?.data?.data?.sheet) {
        const stats = await transformExternalData(response.data.data);
        
        // Refresh data
        await fetchTopics();
        
        alert(`Data imported successfully!\n\nImported:\n- ${stats.topicsImported} topics\n- ${stats.subTopicsImported} subtopics\n- ${stats.questionsImported} questions`);
      } else {
        alert('No data received from external API');
      }
    } catch (error) {
      console.error('Error importing data:', error);
      alert(`Failed to import data: ${error.message || 'Unknown error'}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleImport}
      disabled={isImporting}
      className="w-full"
    >
      {isImporting ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Importing...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Import External Data
        </>
      )}
    </Button>
  );
};

export default ImportDataButton;
