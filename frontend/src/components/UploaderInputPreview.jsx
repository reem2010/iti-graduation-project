"use client";

import { useState, useEffect } from "react";
import { paperClip } from "../lib/svgs";
export default function UploaderInputPreview({ onFileSelect, defurl = "" }) {
  const [preview, setPreview] = useState(defurl);
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    onFileSelect(selectedFile); // send to parent
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="space-y-3">
      <label htmlFor="uploder-input">{paperClip}</label>
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleChange}
        className="block"
        id="uploder-input"
      />
      {preview && (
        <div>
          {file?.type.startsWith("image") ? (
            <img src={preview} alt="preview" className="rounded max-h-60" />
          ) : (
            <video src={preview} controls className="rounded max-h-60" />
          )}
        </div>
      )}
    </div>
  );
}
