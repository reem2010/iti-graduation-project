"use client";

import { useState } from "react";
import UploaderInputPreview from "./UploaderInputPreview";
import { BASE_URL } from "../lib/config";

export default function ArticleForm() {
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

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
    let mediaUrl = "";

    if (selectedFile) {
      mediaUrl = await uploadToCloudinary(selectedFile);
    }

    const articleData = {
      content,
      mediaUrl,
    };
    console.log(articleData);

    // const res = await fetch(`${BASE_URL}/article`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(articleData),
    // });

    // if (res.ok) {
    //   alert("Article submitted!");
    //   setContent("");
    //   setSelectedFile(null);
    // } else {
    //   alert("Error submitting article.");
    // }
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
      <UploaderInputPreview onFileSelect={setSelectedFile} />
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Submit Article
      </button>
    </form>
  );
}
