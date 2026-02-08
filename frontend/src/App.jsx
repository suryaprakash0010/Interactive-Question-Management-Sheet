import React, { useEffect, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Moon, Plus, RefreshCw, Sun, Clock, Calendar } from 'lucide-react';
import Button from './components/common/Button';
import Spinner from './components/common/Spinner';
import SearchBar from './components/ui/SearchBar';
import FilterBar from './components/ui/FilterBar';
import ProgressBar from './components/ui/ProgressBar';
import DraggableTopicCard from './components/ui/DraggableTopicCard';
import AddTopicForm from './components/ui/AddTopicForm';
import ImportDataButton from './components/ui/ImportDataButton';
import StatisticsDashboard from './components/ui/StatisticsDashboard';
import ExportDataButton from './components/ui/ExportDataButton';
import ClearDataButton from './components/ui/ClearDataButton';
import { useQuestionStore } from './store/questionStore';
import { matchesShortcut, keyboardShortcuts } from './utils/helpers';

// CSS variables for Tailwind
const style = document.createElement('style');
style.textContent = `
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }
  
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
`;
document.head.appendChild(style);

function App() {
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [activeData, setActiveData] = useState(null);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('qms_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });
  const [now, setNow] = useState(() => new Date());
  
  const {
    topics,
    subTopics,
    questions,
    topicOrder,
    loading,
    error,
    fetchTopics,
    reorderTopics,
    reorderSubTopics,
    reorderQuestions,
    getFilteredData
  } = useQuestionStore();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Initialize data
  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  useEffect(() => {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('qms_theme', theme);
  }, [theme]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K: Focus search
      if (matchesShortcut(e, keyboardShortcuts['Ctrl+K'])) {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]');
        searchInput?.focus();
      }
      
      // Ctrl+N: New topic
      if (matchesShortcut(e, keyboardShortcuts['Ctrl+N'])) {
        e.preventDefault();
        setShowAddTopic(true);
      }
      
      // Escape: Close modals
      if (matchesShortcut(e, keyboardShortcuts['Escape'])) {
        setShowAddTopic(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    setActiveData(event.active.data.current);
  };
  
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setActiveData(null);
      return;
    }
    
    const activeData = active.data.current;
    const overData = over.data.current;
    
    try {
      if (activeData.type === 'topic' && overData.type === 'topic') {
        // Reordering topics
        const oldIndex = topicOrder.indexOf(active.id);
        const newIndex = topicOrder.indexOf(over.id);
        
        if (oldIndex !== newIndex) {
          const newOrder = [...topicOrder];
          newOrder.splice(oldIndex, 1);
          newOrder.splice(newIndex, 0, active.id);
          
          await reorderTopics(newOrder.map((id, index) => ({ id, order: index })));
        }
      } else if (activeData.type === 'subtopic' && overData.type === 'subtopic') {
        // Reordering subtopics within the same topic
        if (activeData.topicId === overData.topicId) {
          const currentOrder = useQuestionStore.getState().subTopicOrder[activeData.topicId] || [];
          const oldIndex = currentOrder.indexOf(active.id);
          const newIndex = currentOrder.indexOf(over.id);
          
          if (oldIndex !== newIndex) {
            const newOrder = [...currentOrder];
            newOrder.splice(oldIndex, 1);
            newOrder.splice(newIndex, 0, active.id);
            
            await reorderSubTopics(activeData.topicId, newOrder.map((id, index) => ({ id, order: index })));
          }
        }
      } else if (activeData.type === 'question' && overData.type === 'question') {
        // Reordering questions within the same subtopic
        if (activeData.subTopicId === overData.subTopicId) {
          const currentOrder = useQuestionStore.getState().questionOrder[activeData.subTopicId] || [];
          const oldIndex = currentOrder.indexOf(active.id);
          const newIndex = currentOrder.indexOf(over.id);
          
          if (oldIndex !== newIndex) {
            const newOrder = [...currentOrder];
            newOrder.splice(oldIndex, 1);
            newOrder.splice(newIndex, 0, active.id);
            
            await reorderQuestions(activeData.subTopicId, newOrder.map((id, index) => ({ id, order: index })));
          }
        }
      } else if (activeData.type === 'question' && overData.type === 'subtopic') {
        // Moving question to different subtopic
        if (activeData.subTopicId !== overData.id) {
          // This would require updating the question's subTopicId
          // For now, we'll just handle reordering within the same subtopic
          console.log('Moving questions between subtopics not implemented yet');
        }
      }
    } catch (error) {
      console.error('Failed to reorder:', error);
    }
    
    setActiveId(null);
    setActiveData(null);
  };
  
  const filteredData = getFilteredData();
  
  if (loading && Object.keys(topics).length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your questions...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-destructive mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchTopics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
        {/* Header */}
        <header className="border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <div className="leading-tight">
                  <h1 className="text-lg sm:text-xl font-semibold tracking-tight">Question Management Sheet</h1>
                  <p className="hidden md:block text-xs text-muted-foreground">Organize. Track. Iterate.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                  <Button variant="ghost" className="h-8 px-2 flex items-center gap-2" title="Current time">
                    <Clock className="h-4 w-4" />
                    <span className="whitespace-nowrap">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  </Button>
                  <Button variant="ghost" className="h-8 px-2 flex items-center gap-2" title="Day of week">
                    <Calendar className="h-4 w-4" />
                    <span className="whitespace-nowrap">{now.toLocaleDateString(undefined, { weekday: 'long' })}</span>
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-4 lg:mr-20">
                <SearchBar className="" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                  title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  className="h-10 w-10"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
                <Button onClick={() => setShowAddTopic(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Topic
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-80 lg:shrink-0 space-y-6">
              <StatisticsDashboard />
              <ProgressBar />
              <FilterBar />
              <div className="space-y-2">
                <ImportDataButton />
                <ExportDataButton />
              </div>
              <ClearDataButton />
            </div>
            
            {/* Topics */}
            <div className="flex-1 lg:ml-6 min-w-0">
              {showAddTopic && (
                <AddTopicForm
                  onCancel={() => setShowAddTopic(false)}
                  onSuccess={() => setShowAddTopic(false)}
                />
              )}
              
              {filteredData.topics.length > 0 ? (
                <SortableContext
                  items={filteredData.topics.map(t => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-6">
                    {filteredData.topics.map((topic) => (
                      <DraggableTopicCard
                        key={topic.id}
                        topic={topic}
                        subTopics={filteredData.subTopics}
                        questions={filteredData.questions}
                      />
                    ))}
                  </div>
                </SortableContext>
              ) : (
                !showAddTopic && (
                  <div className="text-center py-16">
                    <div className="text-muted-foreground mb-6">
                      <svg className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <h2 className="text-2xl font-semibold mb-2">No topics yet</h2>
                      <p className="text-lg mb-6">Create your first topic to start organizing your questions</p>
                    </div>
                    <Button onClick={() => setShowAddTopic(true)} size="lg">
                      <Plus className="h-5 w-5 mr-2" />
                      Create Your First Topic
                    </Button>
                  </div>
                )
              )}
            </div>
          </div>
        </main>
      </div>
      
      <DragOverlay>
        {activeId && activeData ? (
          <div className="opacity-90">
            {activeData.type === 'topic' && (
              <div className="bg-card border rounded-lg p-4 shadow-lg">
                <h3 className="font-semibold">{topics[activeId]?.title}</h3>
              </div>
            )}
            {activeData.type === 'subtopic' && (
              <div className="bg-card border rounded-lg p-3 shadow-lg">
                <h4 className="font-medium">{subTopics[activeId]?.title}</h4>
              </div>
            )}
            {activeData.type === 'question' && (
              <div className="bg-card border rounded-lg p-3 shadow-lg">
                <h4 className="font-medium text-sm">{questions[activeId]?.title}</h4>
              </div>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
