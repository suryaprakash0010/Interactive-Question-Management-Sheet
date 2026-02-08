import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { api } from '../utils/api';

// Initial state shape - normalized for performance
const initialState = {
  // Normalized data
  topics: {},
  subTopics: {},
  questions: {},
  
  // UI state
  loading: false,
  error: null,
  searchQuery: '',
  filters: {
    difficulty: 'all',
    status: 'all'
  },
  
  // Ordering arrays for drag and drop
  topicOrder: [],
  subTopicOrder: {}, // { topicId: [subTopicId1, subTopicId2, ...] }
  questionOrder: {}, // { subTopicId: [questionId1, questionId2, ...] }
  
  // Undo/Redo stack
  history: [],
  historyIndex: -1,
  maxHistorySize: 50
};

// Utility functions for state management
const normalizeTopics = (topics) => {
  const normalized = {};
  const order = [];
  
  topics.forEach(topic => {
    normalized[topic._id] = {
      ...topic,
      id: topic._id,
      subTopicIds: topic.subTopics?.map(st => st._id) || []
    };
    order.push(topic._id);
  });
  
  return { normalized, order };
};

const normalizeSubTopics = (subTopics) => {
  const normalized = {};
  const subTopicOrder = {};
  
  subTopics.forEach(subTopic => {
    normalized[subTopic._id] = {
      ...subTopic,
      id: subTopic._id,
      questionIds: subTopic.questions?.map(q => q._id) || []
    };
    
    if (!subTopicOrder[subTopic.topicId]) {
      subTopicOrder[subTopic.topicId] = [];
    }
    subTopicOrder[subTopic.topicId].push(subTopic._id);
  });
  
  return { normalized, subTopicOrder };
};

const normalizeQuestions = (questions) => {
  const normalized = {};
  const questionOrder = {};
  
  questions.forEach(question => {
    normalized[question._id] = {
      ...question,
      id: question._id
    };
    
    if (!questionOrder[question.subTopicId]) {
      questionOrder[question.subTopicId] = [];
    }
    questionOrder[question.subTopicId].push(question._id);
  });
  
  return { normalized, questionOrder };
};

// Create the store
export const useQuestionStore = create(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      // Fetch data
      fetchTopics: async () => {
        try {
          set({ loading: true, error: null });
          const response = await api.get('/topics');
          const topics = response.data;
          
          const { normalized: topicsNorm, order } = normalizeTopics(topics);
          const allSubTopics = topics.flatMap(t => t.subTopics || []);
          const { normalized: subTopicsNorm, subTopicOrder } = normalizeSubTopics(allSubTopics);
          const allQuestions = allSubTopics.flatMap(st => st.questions || []);
          const { normalized: questionsNorm, questionOrder } = normalizeQuestions(allQuestions);
          
          set({
            topics: topicsNorm,
            subTopics: subTopicsNorm,
            questions: questionsNorm,
            topicOrder: order,
            subTopicOrder,
            questionOrder,
            loading: false
          });
        } catch (error) {
          set({ 
            error: error.response?.data?.error || 'Failed to fetch topics',
            loading: false 
          });
        }
      },
      
      // Topic actions
      addTopic: async (topicData) => {
        try {
          const response = await api.post('/topics', topicData);
          const newTopic = response.data;
          
          set(state => ({
            topics: {
              ...state.topics,
              [newTopic._id]: { ...newTopic, id: newTopic._id, subTopicIds: [] }
            },
            topicOrder: [...state.topicOrder, newTopic._id]
          }));
          
          return newTopic;
        } catch (error) {
          set({ error: error.response?.data?.error || 'Failed to add topic' });
          throw error;
        }
      },
      
      updateTopic: async (id, updates) => {
        try {
          const response = await api.put(`/topics/${id}`, updates);
          const updatedTopic = response.data;
          
          set(state => ({
            topics: {
              ...state.topics,
              [id]: { ...state.topics[id], ...updatedTopic }
            }
          }));
          
          return updatedTopic;
        } catch (error) {
          set({ error: error.response?.data?.error || 'Failed to update topic' });
          throw error;
        }
      },
      
      deleteTopic: async (id) => {
        try {
          await api.delete(`/topics/${id}`);
          
          set(state => {
            const newTopics = { ...state.topics };
            delete newTopics[id];
            
            const newSubTopics = { ...state.subTopics };
            const newQuestions = { ...state.questions };
            
            // Remove associated subtopics and questions
            Object.values(newSubTopics).forEach(subTopic => {
              if (subTopic.topicId === id) {
                delete newSubTopics[subTopic.id];
                subTopic.questionIds?.forEach(qId => {
                  delete newQuestions[qId];
                });
              }
            });
            
            const newSubTopicOrder = { ...state.subTopicOrder };
            delete newSubTopicOrder[id];
            
            Object.values(newSubTopicOrder).forEach(questions => {
              questions.forEach(qId => {
                if (newQuestions[qId]?.subTopicId === id) {
                  delete newQuestions[qId];
                }
              });
            });
            
            return {
              topics: newTopics,
              subTopics: newSubTopics,
              questions: newQuestions,
              topicOrder: state.topicOrder.filter(topicId => topicId !== id),
              subTopicOrder: newSubTopicOrder
            };
          });
        } catch (error) {
          set({ error: error.response?.data?.error || 'Failed to delete topic' });
          throw error;
        }
      },
      
      // SubTopic actions
      addSubTopic: async (subTopicData) => {
        try {
          const response = await api.post('/subtopics', subTopicData);
          const newSubTopic = response.data;
          
          set(state => ({
            subTopics: {
              ...state.subTopics,
              [newSubTopic._id]: { ...newSubTopic, id: newSubTopic._id, questionIds: [] }
            },
            subTopicOrder: {
              ...state.subTopicOrder,
              [newSubTopic.topicId]: [
                ...(state.subTopicOrder[newSubTopic.topicId] || []),
                newSubTopic._id
              ]
            },
            topics: {
              ...state.topics,
              [newSubTopic.topicId]: {
                ...state.topics[newSubTopic.topicId],
                subTopicIds: [
                  ...(state.topics[newSubTopic.topicId]?.subTopicIds || []),
                  newSubTopic._id
                ]
              }
            }
          }));
          
          return newSubTopic;
        } catch (error) {
          set({ error: error.response?.data?.error || 'Failed to add subtopic' });
          throw error;
        }
      },
      
      updateSubTopic: async (id, updates) => {
        try {
          const response = await api.put(`/subtopics/${id}`, updates);
          const updatedSubTopic = response.data;
          
          set(state => ({
            subTopics: {
              ...state.subTopics,
              [id]: { ...state.subTopics[id], ...updatedSubTopic }
            }
          }));
          
          return updatedSubTopic;
        } catch (error) {
          set({ error: error.response?.data?.error || 'Failed to update subtopic' });
          throw error;
        }
      },
      
      deleteSubTopic: async (id) => {
        try {
          await api.delete(`/subtopics/${id}`);
          
          set(state => {
            const subTopic = state.subTopics[id];
            const newSubTopics = { ...state.subTopics };
            delete newSubTopics[id];
            
            const newQuestions = { ...state.questions };
            subTopic.questionIds?.forEach(qId => {
              delete newQuestions[qId];
            });
            
            const newSubTopicOrder = { ...state.subTopicOrder };
            newSubTopicOrder[subTopic.topicId] = newSubTopicOrder[subTopic.topicId].filter(
              stId => stId !== id
            );
            
            const newQuestionOrder = { ...state.questionOrder };
            delete newQuestionOrder[id];
            
            return {
              subTopics: newSubTopics,
              questions: newQuestions,
              subTopicOrder: newSubTopicOrder,
              questionOrder: newQuestionOrder,
              topics: {
                ...state.topics,
                [subTopic.topicId]: {
                  ...state.topics[subTopic.topicId],
                  subTopicIds: state.topics[subTopic.topicId].subTopicIds.filter(stId => stId !== id)
                }
              }
            };
          });
        } catch (error) {
          set({ error: error.response?.data?.error || 'Failed to delete subtopic' });
          throw error;
        }
      },
      
      // Question actions
      addQuestion: async (questionData) => {
        try {
          const response = await api.post('/questions', questionData);
          const newQuestion = response.data;
          
          set(state => ({
            questions: {
              ...state.questions,
              [newQuestion._id]: { ...newQuestion, id: newQuestion._id }
            },
            questionOrder: {
              ...state.questionOrder,
              [newQuestion.subTopicId]: [
                ...(state.questionOrder[newQuestion.subTopicId] || []),
                newQuestion._id
              ]
            },
            subTopics: {
              ...state.subTopics,
              [newQuestion.subTopicId]: {
                ...state.subTopics[newQuestion.subTopicId],
                questionIds: [
                  ...(state.subTopics[newQuestion.subTopicId]?.questionIds || []),
                  newQuestion._id
                ]
              }
            }
          }));
          
          return newQuestion;
        } catch (error) {
          set({ error: error.response?.data?.error || 'Failed to add question' });
          throw error;
        }
      },
      
      updateQuestion: async (id, updates) => {
        try {
          const response = await api.put(`/questions/${id}`, updates);
          const updatedQuestion = response.data;
          
          set(state => ({
            questions: {
              ...state.questions,
              [id]: { ...state.questions[id], ...updatedQuestion }
            }
          }));
          
          return updatedQuestion;
        } catch (error) {
          set({ error: error.response?.data?.error || 'Failed to update question' });
          throw error;
        }
      },
      
      deleteQuestion: async (id) => {
        try {
          await api.delete(`/questions/${id}`);
          
          set(state => {
            const question = state.questions[id];
            const newQuestions = { ...state.questions };
            delete newQuestions[id];
            
            const newQuestionOrder = { ...state.questionOrder };
            newQuestionOrder[question.subTopicId] = newQuestionOrder[question.subTopicId].filter(
              qId => qId !== id
            );
            
            return {
              questions: newQuestions,
              questionOrder: newQuestionOrder,
              subTopics: {
                ...state.subTopics,
                [question.subTopicId]: {
                  ...state.subTopics[question.subTopicId],
                  questionIds: state.subTopics[question.subTopicId].questionIds.filter(qId => qId !== id)
                }
              }
            };
          });
        } catch (error) {
          set({ error: error.response?.data?.error || 'Failed to delete question' });
          throw error;
        }
      },
      
      // Reorder actions
      reorderTopics: async (newOrder) => {
        try {
          await api.put('/topics/reorder', { topics: newOrder });
          set({ topicOrder: newOrder });
        } catch (error) {
          set({ error: error.response?.data?.error || 'Failed to reorder topics' });
          throw error;
        }
      },
      
      reorderSubTopics: async (topicId, newOrder) => {
        try {
          await api.put('/subtopics/reorder', { subTopics: newOrder });
          set(state => ({
            subTopicOrder: {
              ...state.subTopicOrder,
              [topicId]: newOrder
            }
          }));
        } catch (error) {
          set({ error: error.response?.data?.error || 'Failed to reorder subtopics' });
          throw error;
        }
      },
      
      reorderQuestions: async (subTopicId, newOrder) => {
        try {
          await api.put('/questions/reorder', { questions: newOrder });
          set(state => ({
            questionOrder: {
              ...state.questionOrder,
              [subTopicId]: newOrder
            }
          }));
        } catch (error) {
          set({ error: error.response?.data?.error || 'Failed to reorder questions' });
          throw error;
        }
      },
      
      // Search and filter actions
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilters: (filters) => set(state => ({ filters: { ...state.filters, ...filters } })),
      
      // Data management actions
      clearAllData: async () => {
        try {
          // Clear all entities
          set(state => ({
            topics: {},
            subTopics: {},
            questions: {},
            topicOrder: [],
            subTopicOrder: {},
            questionOrder: {},
            searchQuery: '',
            filters: { difficulty: 'all', status: 'all' }
          }));
          
          // Optionally call API to clear backend data
          // await api.delete('/topics/clear-all');
        } catch (error) {
          console.error('Error clearing data:', error);
          throw error;
        }
      },
      
      // Computed selectors
      getFilteredData: () => {
        const state = get();
        const { searchQuery, filters, topics, subTopics, questions } = state;
        
        let filteredQuestions = Object.values(questions);
        let filteredSubTopics = Object.values(subTopics);
        let filteredTopics = Object.values(topics);
        
        // Apply search
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          
          // Filter questions
          filteredQuestions = filteredQuestions.filter((q) => {
            const title = (q?.title ?? '').toString().toLowerCase();
            const description = (q?.description ?? '').toString().toLowerCase();
            const tags = Array.isArray(q?.tags) ? q.tags : [];

            return (
              title.includes(query) ||
              description.includes(query) ||
              tags.some((tag) => (tag ?? '').toString().toLowerCase().includes(query))
            );
          });
          
          // Filter subtopics
          filteredSubTopics = filteredSubTopics.filter((st) => {
            const title = (st?.title ?? '').toString().toLowerCase();
            const description = (st?.description ?? '').toString().toLowerCase();
            return title.includes(query) || description.includes(query);
          });
          
          // Filter topics
          filteredTopics = filteredTopics.filter((t) => {
            const title = (t?.title ?? '').toString().toLowerCase();
            const description = (t?.description ?? '').toString().toLowerCase();
            return title.includes(query) || description.includes(query);
          });
        }
        
        // Apply filters to questions
        if (filters.difficulty !== 'all') {
          filteredQuestions = filteredQuestions.filter(q => q.difficulty === filters.difficulty);
        }
        
        if (filters.status !== 'all') {
          filteredQuestions = filteredQuestions.filter(q => q.status === filters.status);
        }
        
        // Filter subtopics to only include those with matching questions
        const questionSubTopicIds = new Set(filteredQuestions.map(q => q.subTopicId));
        filteredSubTopics = filteredSubTopics.filter(st => questionSubTopicIds.has(st._id));
        
        // Filter topics to only include those with matching subtopics
        const subTopicTopicIds = new Set(filteredSubTopics.map(st => st.topicId));
        filteredTopics = filteredTopics.filter(t => subTopicTopicIds.has(t._id));
        
        return {
          topics: filteredTopics,
          subTopics: filteredSubTopics,
          questions: filteredQuestions
        };
      },
      
      // Progress tracking
      getProgress: () => {
        const state = get();
        const questions = Object.values(state.questions);
        
        const total = questions.length;
        const completed = questions.filter(q => q.status === 'Done').length;
        const todo = questions.filter(q => q.status === 'Todo').length;
        const revising = questions.filter(q => q.status === 'Revising').length;
        
        return {
          total,
          completed,
          todo,
          revising,
          completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
      }
    }),
    {
      name: 'question-store'
    }
  )
);
