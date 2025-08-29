"use client";
import {
  AlertCircle,
  Eye,
  FolderOpen,
  Image as ImageIcon,
  Loader2,
  Upload,
  X,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StorageService } from "@/services/storageService";
import ImageSelectorModal from "./ImageSelectorModal";
import { Card, CardContent } from "@/components/ui/card";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  label,
  placeholder = "Upload an image",
  className = "",
  disabled = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showSelector, setShowSelector] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log("ImageUpload received value:", value);
    if (value && value !== preview) {
      setPreview(value);
      setError("");
    }
  }, [value]);

  // Auto-clear messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleDirectUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || disabled) return;

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      StorageService.validateImageFile(file);

      const previewUrl = await StorageService.createImagePreview(file);
      setPreview(previewUrl);

      const result = await StorageService.uploadImageWithPreview(file);

      onChange(result.url);
      setPreview(result.url);
      setSuccess("✅ Image uploaded successfully!");
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
    if (disabled) return;
    onChange(url);
    setPreview(url);
    setError("");
    setSuccess("✅ Image selected from gallery!");
    setShowSelector(false);
  };

  const handleRemove = () => {
    if (disabled) return;
    onChange("");
    setPreview("");
    setError("");
    setSuccess("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleViewImage = () => {
    if (preview) {
      window.open(preview, "_blank");
    }
  };

  const handleImageError = () => {
    console.error("Image failed to load:", preview);
    setError("Failed to load image. Please try uploading again.");
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    console.log("Image loaded successfully:", preview);
    setError("");
    setImageLoading(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="space-y-2">
        <Label className="text-foreground font-heading font-semibold flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-primary" />
          {label}
        </Label>
        <p className="text-sm text-muted-foreground font-sans">
          Upload a new image or select from your gallery. Supports JPG, PNG, WebP, and GIF formats.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="font-sans font-medium">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-emerald-200 bg-emerald-50">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          <AlertDescription className="text-emerald-800 font-sans font-medium">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleDirectUpload}
              className="hidden"
              disabled={disabled}
            />

            {/* Upload from Device Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || disabled}
              className="flex items-center space-x-2 font-heading bg-primary/10 border-primary/30 hover:bg-primary/20"
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
              disabled={uploading || disabled}
              className="flex items-center space-x-2 font-heading"
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
                  disabled={disabled}
                  className="flex items-center space-x-1 font-heading hover:bg-primary/10"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  disabled={disabled}
                  className="flex items-center space-x-1 text-destructive hover:text-destructive/80 hover:bg-destructive/10 font-heading"
                >
                  <X className="h-4 w-4" />
                  <span>Remove</span>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Preview with Next.js Image component */}
      {preview ? (
        <Card className="bg-card border-border w-fit">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="relative w-32 h-32 border border-border rounded-lg overflow-hidden bg-muted/20">
                <img
                  src={preview}
                  alt="Image preview"
                  sizes="(max-width: 128px) 100vw, 128px"
                  className="object-cover"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  onLoadStart={() => setImageLoading(true)}
                />

                {/* Loading Overlay */}
                {(uploading || imageLoading) && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}
              </div>

              {/* Status and URL Info */}
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  {uploading ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin text-primary" />
                      <span className="text-xs text-primary font-sans font-medium">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                      <span className="text-xs text-emerald-600 font-sans font-medium">Ready</span>
                    </>
                  )}
                </div>
                <div className="text-xs text-muted-foreground font-mono break-all max-w-32 bg-muted/20 p-2 rounded border">
                  {preview.length > 50 ? `${preview.substring(0, 47)}...` : preview}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Empty State */
        <Card className="bg-card border-border border-dashed">
          <CardContent className="p-6">
            <div className="w-32 h-32 flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-heading font-semibold">No Image Selected</p>
                  <p className="text-xs font-sans">{placeholder}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Selector Modal - Solid Background */}
      <ImageSelectorModal
        isOpen={showSelector}
        onClose={() => setShowSelector(false)}
        onSelect={handleImageSelect}
      />
    </div>
  );
}
