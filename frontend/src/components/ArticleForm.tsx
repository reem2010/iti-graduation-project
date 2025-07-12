"use client";

import { useState, useRef } from "react";

interface ArticleFormProps {
  mode?: "create" | "edit";
  articleId?: string;
  initialContent?: string;
  initialMediaUrl?: string;
}

export default function ArticleForm({
  mode = "create",
  articleId,
  initialContent = "",
  initialMediaUrl = "",
}: ArticleFormProps) {
  const [content, setContent] = useState(initialContent);
  const [mediaUrl, setMediaUrl] = useState(initialMediaUrl);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasNewFile, setHasNewFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      { method: "POST", body: formData }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "Upload failed");
    }
    return data.secure_url;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setHasNewFile(true);
      setMediaUrl("");
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaUrl("");
    setPreviewUrl(null);
    setHasNewFile(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("Content is required");
      return;
    }

    setIsSubmitting(true);

    try {
      let finalMediaUrl: string | undefined = mediaUrl;

      if (mediaFile) {
        setIsUploading(true);
        try {
          finalMediaUrl = await uploadToCloudinary(mediaFile);
        } catch (err) {
          console.error("Upload error:", err);
          alert("Failed to upload media. Try again.");
          return;
        } finally {
          setIsUploading(false);
        }
      }

      const payload: { content: string; media?: string } = {
        content: content.trim(),
      };
      if (finalMediaUrl) payload.media = finalMediaUrl;

      const endpoint =
        mode === "edit" ? `/api/article/${articleId}` : `/api/article`;
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(`Article ${mode === "edit" ? "updated" : "created"}!`);
        window.location.href = "/articles"; // or redirect to detail page
      } else {
        alert("Failed to save article.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = isUploading || isSubmitting;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">
          {mode === "edit" ? "Edit Article" : "Create New Article"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Content Field */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article content here..."
              className="w-full min-h-[300px] p-4 rounded-lg resize-vertical"
              disabled={isFormDisabled}
              required
            />
          </div>

          {/* Media Upload Field */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Media (Optional)
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="block w-full text-sm disabled:opacity-50"
              disabled={isFormDisabled}
            />

            {(previewUrl || (mediaUrl && !hasNewFile)) && (
              <div className="relative mt-4">
                <div className="rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {hasNewFile ? "New Media Preview:" : "Current Media:"}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveMedia}
                      className="text-sm font-medium"
                      disabled={isFormDisabled}
                    >
                      Remove
                    </button>
                  </div>

                  {(() => {
                    const displayUrl = previewUrl || mediaUrl;
                    const isVideo =
                      displayUrl?.includes("video") ||
                      mediaFile?.type.startsWith("video/");

                    return isVideo ? (
                      <video
                        src={displayUrl}
                        controls
                        className="max-w-full max-h-64 rounded-lg"
                      />
                    ) : (
                      <img
                        src={displayUrl}
                        alt="Media preview"
                        className="max-w-full max-h-64 object-contain rounded-lg"
                      />
                    );
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2 rounded-lg disabled:opacity-50"
              disabled={isFormDisabled}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isFormDisabled || !content.trim()}
              className="px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {(isUploading || isSubmitting) && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              <span>
                {isUploading
                  ? "Uploading..."
                  : isSubmitting
                  ? "Saving..."
                  : mode === "edit"
                  ? "Update Article"
                  : "Create Article"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
