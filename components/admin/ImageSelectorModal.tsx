"use client";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  FileImage,
  Image as ImageIcon,
  Loader2,
  Search,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type StorageFile, StorageService } from "@/services/storageService";

interface ImageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export default function ImageSelectorModal({
  isOpen,
  onClose,
  onSelect,
}: ImageSelectorModalProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [assets, setAssets] = useState<StorageFile[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<StorageFile[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(
    new Set(),
  );

  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    // Filter assets based on search term
    if (searchTerm.trim()) {
      const filtered = assets.filter((asset) =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredAssets(filtered);
    } else {
      setFilteredAssets(assets);
    }
  }, [assets, searchTerm]);

  const loadAssets = async () => {
    try {
      setLoading(true);
      setError("");

      const assetsList = await StorageService.listAllAssets();
      setAssets(assetsList);
      setFilteredAssets(assetsList);
    } catch (error: any) {
      setError(error.message || "Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAssets();
    } else {
      // Reset state when modal closes
      setError("");
      setSuccess("");
      setSearchTerm("");
      setSelectedImage("");
      setImageLoadErrors(new Set());
    }
  }, [isOpen, loadAssets]);

  const handleImageSelect = (url: string) => {
    onSelect(url);
    onClose();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      // Validate and upload
      const result = await StorageService.uploadImageWithPreview(file);

      // Refresh the gallery
      await loadAssets();

      setSuccess("Image uploaded successfully!");
      setTimeout(() => {
        onSelect(result.url);
        onClose();
      }, 1000);
    } catch (error: any) {
      setError(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handlePreviewImage = (url: string) => {
    window.open(url, "_blank");
  };

  const handleImageError = (url: string) => {
    console.log("Image failed to load:", url);
    setImageLoadErrors((prev) => new Set(prev).add(url));
  };

  const handleImageLoad = (url: string) => {
    // Remove from error set if image loads successfully
    setImageLoadErrors((prev) => {
      const newSet = new Set(prev);
      newSet.delete(url);
      return newSet;
    });
  };

  const isImage = (fileName: string) => {
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
      ".bmp",
    ];
    return imageExtensions.some((ext) => fileName.toLowerCase().includes(ext));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        {/* ✅ Single Header with only one close mechanism */}
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ImageIcon className="h-5 w-5 text-blue-600" />
            <span>Select or Upload Image</span>
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="gallery" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="gallery"
              className="flex items-center space-x-2"
            >
              <ImageIcon className="h-4 w-4" />
              <span>Select From Gallery</span>
              <Badge variant="outline" className="ml-1">
                {filteredAssets.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload New</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* ✅ Enhanced Image Gallery */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading images...</span>
                </div>
              ) : filteredAssets.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredAssets.map((asset) => {
                    const hasError = imageLoadErrors.has(asset.url);
                    const isImageFile = isImage(asset.name);

                    return (
                      <div
                        key={asset.fullPath}
                        className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                          selectedImage === asset.url
                            ? "border-blue-500 ring-2 ring-blue-200 shadow-lg"
                            : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                        }`}
                        onClick={() => setSelectedImage(asset.url)}
                      >
                        {/* ✅ Improved image container with better sizing and fallback */}
                        <div className="aspect-square relative bg-gradient-to-br from-gray-100 to-gray-200">
                          {isImageFile && !hasError ? (
                            <img
                              src={asset.url}
                              alt={asset.name}
                              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                              loading="lazy"
                              onError={() => handleImageError(asset.url)}
                              onLoad={() => handleImageLoad(asset.url)}
                              style={{
                                objectFit: "cover",
                                objectPosition: "center",
                              }}
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-100">
                              <FileImage className="h-8 w-8 text-blue-400 mb-2" />
                              <span className="text-xs text-blue-600 font-medium">
                                {hasError ? "Failed to load" : "Image file"}
                              </span>
                            </div>
                          )}

                          {/* Loading overlay for images */}
                          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center opacity-0">
                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                          </div>
                        </div>

                        {/* ✅ Enhanced overlay with better actions */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 space-x-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              className="bg-white hover:bg-gray-100 text-gray-900"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePreviewImage(asset.url);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageSelect(asset.url);
                              }}
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* ✅ Improved file name display */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="truncate font-medium">
                            {asset.name}
                          </div>
                          {asset.size && (
                            <div className="text-xs opacity-75">
                              {(asset.size / 1024).toFixed(1)} KB
                            </div>
                          )}
                        </div>

                        {/* Selection indicator */}
                        {selectedImage === asset.url && (
                          <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? "No images found" : "No images available"}
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm
                      ? `No images match "${searchTerm}"`
                      : "Upload some images to get started"}
                  </p>
                </div>
              )}
            </div>

            {/* ✅ Enhanced selection actions */}
            {selectedImage && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-blue-200">
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Image selected
                    </p>
                    <p className="text-xs text-blue-600">
                      Ready to use this image
                    </p>
                  </div>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedImage("")}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleImageSelect(selectedImage)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Use This Image
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>

              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload New Image
                </h3>
                <p className="text-gray-600 mb-4">
                  Choose an image file from your device
                </p>
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <span>JPEG, PNG, WebP, GIF</span>
                  <span>•</span>
                  <span>Max 5MB</span>
                </div>
              </div>

              <Button
                onClick={handleUploadClick}
                disabled={uploading}
                className="min-w-[140px]"
                size="lg"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
