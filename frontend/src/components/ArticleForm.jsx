"use client";

import { useState } from "react";
import UploaderInputPreview from "./UploaderInputPreview";
import { BASE_URL } from "../lib/config";

export default function ArticleForm({
  initialContent = "",
  initialMediaUrl = "",
  onSubmit,
}) {
  const [content, setContent] = useState(initialContent);
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingMediaUrl, setExistingMediaUrl] = useState(initialMediaUrl);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let mediaUrl = existingMediaUrl;
    if (selectedFile) {
      mediaUrl = await uploadToCloudinary(selectedFile);
    }

    const articleData = {
      content,
      mediaUrl,
    };
    // await onSubmit(articleData);

    console.log("Data:", articleData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 min-h-screen">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Your word can be a new life for someone"
        rows={6}
        className="w-full p-2 border rounded"
      />
      <UploaderInputPreview
        onFileSelect={setSelectedFile}
        defurl={existingMediaUrl}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Submit Article
      </button>
    </form>
  );
}
