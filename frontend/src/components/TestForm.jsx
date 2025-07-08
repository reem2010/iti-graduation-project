"use client";
import { useState } from "react";
import { BASE_URL } from "../lib/config";
import CloudinaryUploader from "./UploadToCloudinary";
export default function TestForm() {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const articleData = {
      content,
      mediaUrl,
    };

    console.log(articleData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Your word can be a new life for some one"
          rows={6}
        />
        <label htmlFor="fileupload">file</label>
        <input type="file" name="fileupload" id="fileupload" />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Submit Article
        </button>
      </form>
    </div>
  );
}
