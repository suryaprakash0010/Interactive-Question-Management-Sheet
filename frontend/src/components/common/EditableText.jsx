import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/helpers';

const EditableText = ({ 
  value, 
  onChange, 
  placeholder = 'Click to edit',
  className,
  inputClassName,
  multiline = false,
  maxLength,
  onSave,
  onCancel
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const inputRef = useRef(null);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current.setSelectionRange) {
        inputRef.current.setSelectionRange(editValue.length, editValue.length);
      }
    }
  }, [isEditing, editValue.length]);
  
  const handleStartEdit = () => {
    setEditValue(value || '');
    setIsEditing(true);
  };
  
  const handleSave = () => {
    if (editValue.trim() !== value) {
      onChange?.(editValue.trim());
      onSave?.(editValue.trim());
    }
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditValue(value || '');
    setIsEditing(false);
    onCancel?.();
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };
  
  const handleBlur = () => {
    handleSave();
  };
  
  if (isEditing) {
    const InputComponent = multiline ? 'textarea' : 'input';
    
    return (
      <InputComponent
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        className={cn(
          'w-full px-2 py-1 text-sm border border-primary rounded focus:outline-none focus:ring-1 focus:ring-primary resize-none',
          multiline && 'min-h-[60px]',
          inputClassName
        )}
      />
    );
  }
  
  return (
    <div
      onClick={handleStartEdit}
      className={cn(
        'cursor-text hover:bg-muted/50 rounded px-2 py-1 text-sm min-h-[24px] flex items-center',
        !value && 'text-muted-foreground italic',
        className
      )}
    >
      {value || placeholder}
    </div>
  );
};

export default EditableText;
