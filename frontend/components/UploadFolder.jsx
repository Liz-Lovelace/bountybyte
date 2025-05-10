import React, { useRef, useState } from 'react';
import JSZip from 'jszip';

const UploadFolder = ({ onChange, disabled }) => {
  const fileInputRef = useRef(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFolderSelect = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      try {
        setIsCompressing(true);
        
        // Create a new zip file
        const zip = new JSZip();
        
        // Add each file to the zip
        for (const file of files) {
          const relativePath = file.webkitRelativePath;
          const fileContent = await readFileAsArrayBuffer(file);
          zip.file(relativePath, fileContent);
        }
        
        // Generate the zip file as base64 string
        const zipBase64 = await zip.generateAsync({ 
          type: 'base64',
          compression: 'DEFLATE',
          compressionOptions: { level: 5 }
        });
        
        onChange({
          fileCount: files.length,
          zipBase64,
          isCompressing: false
        });
        
        setIsCompressing(false);
      } catch (error) {
        console.error('Error creating zip file:', error);
        setIsCompressing(false);
      }
    }
  };

  // Helper function to read file content as ArrayBuffer
  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isCompressing}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCompressing ? "Compressing files..." : "Upload Folder"}
      </button>
      {isCompressing && (
        <div className="mt-2 text-sm text-blue-600">
          Compressing files, please wait...
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFolderSelect}
        style={{ display: 'none' }}
        webkitdirectory="true"
        directory="true"
        multiple
        disabled={disabled || isCompressing}
      />
    </div>
  );
};

export default UploadFolder; 