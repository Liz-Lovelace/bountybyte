import { useState, useRef } from 'react';
import { deviconIcons } from '../../listOfDevIcons.js';
import TechPill from '../TechPill.jsx';

let allIconNames = Object.keys(deviconIcons);

export default function DevIconInput({ onSubmit }) {
  const [value, setValue] = useState('');
  const [matches, setMatches] = useState([]);
  const containerRef = useRef(null);

  // Fuzzy match function (simple substring, case-insensitive)
  function getMatches(val) {
    if (!val) return [];
    const lower = val.toLowerCase();
    return allIconNames
      .filter(name => name.toLowerCase().includes(lower))
      .slice(0, 5);
  }

  function handleChange(e) {
    const val = e.target.value;
    setValue(val);
    setMatches(getMatches(val));
  }

  function handleSubmit(val, e) {
    if(e) {
      e.preventDefault();
    }
    if (!val) return;
    onSubmit(val);
    setValue('');
    setMatches([]);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleSubmit(value, e);
    }
  }

  function handleSuggestionClick(suggestion) {
    handleSubmit(suggestion);
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="python, linux, vercel, docker, etc."
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={(e) => handleSubmit(value, e)}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Add
        </button>
      </div>
      {matches.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 z-10 bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-auto">
          {matches.map((name) => (
            <li
              key={name}
              className="px-3 py-2 cursor-pointer hover:bg-blue-100"
              onClick={() => handleSuggestionClick(name)}
            >
              <TechPill iconName={name} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}