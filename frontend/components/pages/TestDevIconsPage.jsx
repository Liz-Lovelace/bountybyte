import React, { useState } from 'react';
import { deviconIcons } from '../../listOfDevIcons.js';
import TechStackInputSection from '../form-primitives/TechStackInputSection.jsx';

export default function TestDevIconsPage() {
  const [selectedTechs, setSelectedTechs] = useState([
    'react', 'typescript', 'nodejs' // some initial values
  ]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tech Stack Editor</h1>
      <TechStackInputSection 
        techIds={selectedTechs}
        updateTechIds={setSelectedTechs}
      />
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Current Selection:</h2>
        <pre className="font-mono">
          {JSON.stringify(selectedTechs, null, 2)}
        </pre>
      </div>
    </div>
  );
} 