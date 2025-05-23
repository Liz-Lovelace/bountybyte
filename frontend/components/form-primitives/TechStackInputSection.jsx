import React from 'react';
import TechPill from '../TechPill';
import DevIconInput from './DevIconInput';

export default function TechStackInputSection({ techIds, updateTechIds }) {
  const handleDelete = (iconName) => {
    updateTechIds(techIds.filter(id => id !== iconName));
  };

  const handleAdd = (newTechId) => {
    if (!techIds.includes(newTechId)) {
      updateTechIds([...techIds, newTechId]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {techIds.map((iconName) => (
          <TechPill 
            key={iconName} 
            iconName={iconName} 
            isDeletable={true}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <DevIconInput onSubmit={handleAdd} />
    </div>
  );
} 