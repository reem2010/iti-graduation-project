import React, { useState } from 'react';
import { useUploadThing } from '@/lib/uploadthing';
import { Upload, X, FileText, Image } from 'lucide-react';

interface FileUploaderProps {
  onUploadComplete: (url: string) => void;
  accept?: string;
  maxSize?: number;
  label: string;
  currentUrl?: string;
}

export default function FileUploader({ 
  onUploadComplete, 
  accept = "image/*,.pdf", 
  maxSize = 4 * 1024 * 1024, // 4MB
  label,
  currentUrl
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const { startUpload } = useUploadThing(
    accept.includes('image') ? "imageUploader" : "pdfUploader",
    {
      onClientUploadComplete: (res) => {
        if (res?.[0]?.url) {
          onUploadComplete(res[0].url);
          setUploading(false);
          setError(null);
        }
      },
      onUploadError: (error) => {
        setError(error.message);
        setUploading(false);
      },
      onUploadProgress: (progress) => {
        setUploadProgress(progress);
      },
    }
  );

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    setUploading(true);
    setError(null);
    
    try {
      await startUpload([file]);
    } catch (err) {
      setError('Upload failed. Please try again.');
      setUploading(false);
    }
  };

  const getFileIcon = (url: string) => {
    if (url.includes('.pdf')) return <FileText className="w-5 h-5" />;
    return <Image className="w-5 h-5" />;
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {currentUrl && (
        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
          {getFileIcon(currentUrl)}
          <a 
            href={currentUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm truncate flex-1"
          >
            View current file
          </a>
        </div>
      )}
      
      <div className="relative">
        <input
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
        />
        
        <label
          htmlFor={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
          className={`
            flex items-center justify-center w-full p-3 border-2 border-dashed rounded-lg cursor-pointer
            transition-colors duration-200
            ${uploading 
              ? 'border-blue-300 bg-blue-50 cursor-not-allowed' 
              : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
            }
          `}
        >
          <div className="text-center">
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500">
              {accept.includes('image') ? 'Images' : 'PDFs'} up to {maxSize / (1024 * 1024)}MB
            </p>
          </div>
        </label>
        
        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">{uploadProgress}% uploaded</p>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-center space-x-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <X className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}
    </div>
  );
}


//test