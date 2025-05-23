import React from 'react';
import { deviconIcons } from '../listOfDevIcons.js';

export default function TechPill({iconName, isDeletable = false, onDelete}) {
  return (
    <div className="w-fit inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
      { deviconIcons[iconName] && <img className="w-6 h-6" src={'/devicon/' + deviconIcons[iconName]} alt={iconName} /> }
      <p>{iconName}</p>
      {isDeletable && (
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling
            onDelete && onDelete(iconName);
          }}
          className="ml-1 text-red-500 hover:text-red-700 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
} 