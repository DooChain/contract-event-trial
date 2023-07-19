"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleUpload = () => {
    if (selectedImage) {
      // Implement your logic for uploading the image here
      console.log("Uploading image:", selectedImage);
    }
  };

  return (
    <div className="m-8">
      <input
        type="file"
        className="hidden"
        id="image-input"
        accept="image/*"
        onChange={handleImageChange}
      />
      <label
        htmlFor="image-input"
        className="flex items-center justify-center w-40 h-40 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 transition-colors duration-300"
      >
        {selectedImage ? (
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected Image"
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <span className="text-gray-500 text-lg font-semibold">
            Select Image
          </span>
        )}
      </label>
      <button
        onClick={handleUpload}
        className="mt-4 px-6 py-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-300"
      >
        Mint
      </button>
    </div>
  );
}
