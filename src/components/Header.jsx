import React, { useState } from 'react';
import axios from 'axios';
import Model from './Model';

const Header = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [taskId, setTaskId] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError(null); 
  };

  const uploadToCloudinary = async () => {
    if (!selectedFile) {
      setError('Please select a file.');
      setTimeout(() => setError(null), 3000); 
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', "s3t1mno3"); 

      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/deklwmu8j/image/upload`,
        formData
      );

      setImageUrl(cloudinaryResponse.data.secure_url); 
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      setError('Error uploading image. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleMeshyUpload = async () => {
    if (!imageUrl) {
      setError('Please upload an image first.');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        image_url: imageUrl,
        enable_pbr: true,
      };

      const headers = {
        Authorization: 'Bearer msy_podjI0ZlCscpQGs4gnVXvKcsJcrTPWL6fH2F',
        'Content-Type': 'application/json'
      };

      const meshyResponse = await axios.post('https://api.meshy.ai/v1/image-to-3d', payload, { headers });

      setTaskId(meshyResponse.data.result);
    } catch (error) {
      console.error('Error creating Image To 3D Task:', error);
      setError('Error creating Image To 3D Task. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            onClick={uploadToCloudinary}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload to Cloudinary'}
          </button>
          <button
            type="button"
            className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 transition duration-300 ease-in-out ${loading || !imageUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleMeshyUpload}
            disabled={loading || !imageUrl}
          >
            {loading ? 'Loading...' : 'Get Started with Meshy'}
          </button>
        </div>
      </div>
      {selectedFile && (
        <div className="max-w-screen-xl mx-auto p-4 text-gray-600 dark:text-gray-300">
          Selected File: {selectedFile.name}
        </div>
      )}
      {error && (
        <div className="max-w-screen-xl mx-auto p-4 text-red-500">
          {error}
        </div>
      )}
      {taskId && (
        <div className="max-w-screen-xl mx-auto p-4 text-green-500">
          Task created successfully. Task ID: {taskId}
        </div>
      )}
    </nav>
    <Model taskId={taskId}/>
    </>
  );
};

export default Header;
