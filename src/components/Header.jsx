import React, { useState } from 'react';

const Header = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    // Reset error message when selecting a new file
    setError(null);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select a file.');
      setTimeout(() => setError(null), 3000); // Reset error message after 3 seconds
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:5000/submit-image', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer {token}`, 
        },
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error submitting file:', error);
      setError('Error submitting file. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <span className="text-2xl font-semibold text-gray-800 dark:text-white">Naya</span>
        <div className="flex items-center space-x-4">
          <label htmlFor="file-input" className="cursor-pointer text-gray-800 dark:text-white bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 transition duration-300 ease-in-out">
            Select File
          </label>
          <input
            type="file"
            accept=".png, .jpg, .jpeg, .webp"
            onChange={handleFileChange}
            className="hidden"
            id="file-input"
          />
          <button
            type="button"
            className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 transition duration-300 ease-in-out ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Get Started'}
          </button>
        </div>
      </div>
      {selectedFile && (
        <div className="max-w-screen-xl mx-auto p-4 text-gray-600 dark:text-gray-300">
          Selected File: {selectedFile.name}
          {setTimeout(() => setSelectedFile(null), 3000)}
        </div>
      )}
      {error && (
        <div className="max-w-screen-xl mx-auto p-4 text-red-500">
          {error}
          {setTimeout(() => setError(null), 3000)}
        </div>
      )}
    </nav>
  );
};

export default Header;
