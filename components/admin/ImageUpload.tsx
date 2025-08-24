'use client'
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StorageService } from "@/services/storageService";
import ImageSelectorModal from "./ImageSelectorModal";
import { Upload, X, Eye, Loader2, AlertCircle, Image as ImageIcon, FolderOpen } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label: string;
  placeholder?: string;
  className?: string;
}

export default function ImageUpload({ 
  value, 
  onChange, 
  label, 
  placeholder = "Upload an image",
  className = ""
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showSelector, setShowSelector] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log('ImageUpload received value:', value);
    if (value && value !== preview) {
      setPreview(value);
    }
  }, [value]);

  const handleDirectUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      StorageService.validateImageFile(file);
      
      const previewUrl = await StorageService.createImagePreview(file);
      setPreview(previewUrl);
      
      const result = await StorageService.uploadImageWithPreview(file);
      
      onChange(result.url);
      setPreview(result.url);
      
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setError(error.message || "Failed to upload image");
      setPreview(value || "");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleImageSelect = (url: string) => {
    onChange(url);
    setPreview(url);
    setError("");
    setShowSelector(false);
  };

  const handleRemove = () => {
    onChange("");
    setPreview("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleViewImage = () => {
    if (preview) {
      window.open(preview, '_blank');
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Image failed to load:', preview);
    (e.target as HTMLImageElement).style.display = 'none';
    setError("Failed to load image. Please try uploading again.");
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log('Image loaded successfully:', preview);
    (e.target as HTMLImageElement).style.display = 'block';
    setError("");
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Label>{label}</Label>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center space-x-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleDirectUpload}
          className="hidden"
        />
        
        {/* Upload from Device Button */}
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center space-x-2"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>Upload New</span>
            </>
          )}
        </Button>

        {/* Select from Gallery Button */}
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowSelector(true)}
          disabled={uploading}
          className="flex items-center space-x-2"
        >
          <FolderOpen className="h-4 w-4" />
          <span>Select from Gallery</span>
        </Button>

        {preview && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleViewImage}
              className="flex items-center space-x-1"
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="flex items-center space-x-1 text-red-600 hover:text-red-800"
            >
              <X className="h-4 w-4" />
              <span>Remove</span>
            </Button>
          </>
        )}
      </div>

      {/* Image Preview */}
      {preview && (
        <div className="mt-3">
          <div className="relative w-32 h-32 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={handleImageError}
              onLoad={handleImageLoad}
              style={{ display: 'block' }}
            />
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {uploading ? (
              <span className="text-blue-600">Uploading...</span>
            ) : (
              <span className="text-green-600">Ready</span>
            )}
          </div>
          <div className="mt-1 text-xs text-gray-400 break-all max-w-32">
            {preview.substring(0, 50)}...
          </div>
        </div>
      )}

      {!preview && (
        <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500">
          <div className="text-center">
            <ImageIcon className="h-8 w-8 mx-auto mb-2" />
            <span className="text-xs">{placeholder}</span>
          </div>
        </div>
      )}

      {/* Image Selector Modal */}
      <ImageSelectorModal
        isOpen={showSelector}
        onClose={() => setShowSelector(false)}
        onSelect={handleImageSelect}
      />
    </div>
  );
}
