import React from 'react';
import { deviconIcons } from '../../listOfDevIcons.js';

function IconPill({iconName}) {
  return (
    <div className="w-fit inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
      <img className="w-6 h-6" src={'/devicon/' + deviconIcons[iconName]} alt={iconName} />
      <p>{iconName}</p>
    </div>
  );
}

export default function TestDevIconsPage() {
  return (
    <div>
      <h1>Dev Icons:</h1>
      <div className="max-w-4xl mx-auto flex flex-wrap gap-2">
        {Object.keys(deviconIcons).map((iconName) => (
          <IconPill key={iconName} iconName={iconName} />
        ))}
      </div>
    </div>
  );
} 