import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import { useQuestionStore } from '../../store/questionStore';
import { cn } from '../../utils/helpers';

const SearchBar = ({ className }) => {
  const [localQuery, setLocalQuery] = useState('');
  const { searchQuery, setSearchQuery } = useQuestionStore();
  
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 250);

    return () => clearTimeout(t);
  }, [localQuery, setSearchQuery]);
  
  const handleChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
  };
  
  const handleClear = () => {
    setLocalQuery('');
    setSearchQuery('');
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };
  
  return (
    <div className={cn('relative w-[22rem] max-w-[70vw] transform-gpu', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={localQuery}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search questions, topics, tags..."
        className="h-10 rounded-full pl-10 pr-10 bg-background/60 backdrop-blur border-border/60 focus-visible:ring-2 focus-visible:ring-ring"
      />
      {localQuery && (
        <Button
          size="icon"
          variant="ghost"
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
