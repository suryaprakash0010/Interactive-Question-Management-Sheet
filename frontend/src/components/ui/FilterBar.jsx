import React from 'react';
import { Filter } from 'lucide-react';
import Button from '../common/Button';
import { useQuestionStore } from '../../store/questionStore';
import { DIFFICULTY_OPTIONS, STATUS_OPTIONS } from '../../utils/helpers';

const FilterBar = () => {
  const { filters, setFilters } = useQuestionStore();
  
  const handleFilterChange = (filterType, value) => {
    setFilters({ [filterType]: value });
  };
  
  const clearFilters = () => {
    setFilters({ difficulty: 'all', status: 'all' });
  };
  
  const hasActiveFilters = filters.difficulty !== 'all' || filters.status !== 'all';
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>Filters:</span>
      </div>
      
      <select
        value={filters.difficulty}
        onChange={(e) => handleFilterChange('difficulty', e.target.value)}
        className="px-3 py-1.5 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
      >
        <option value="all">All Difficulties</option>
        {DIFFICULTY_OPTIONS.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      
      <select
        value={filters.status}
        onChange={(e) => handleFilterChange('status', e.target.value)}
        className="px-3 py-1.5 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
      >
        <option value="all">All Status</option>
        {STATUS_OPTIONS.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      
      {hasActiveFilters && (
        <Button
          size="sm"
          variant="outline"
          onClick={clearFilters}
        >
          Clear
        </Button>
      )}
    </div>
  );
};

export default FilterBar;
