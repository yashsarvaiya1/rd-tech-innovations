"use client";
import {
  AlertCircle,
  CheckCircle,
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
import { ScrollArea } from "@/components/ui/scroll-area";
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = assets.filter((asset) =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredAssets(filtered);
    } else {
      setFilteredAssets(assets);
    }
  }, [assets, searchTerm]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const loadAssets = async () => {
    try {
      setLoading(true);
      setError("");

      const assetsList = await StorageService.listAllAssets();
      setAssets(assetsList);
      setFilteredAssets(assetsList);
    } catch (error: any) {
      const errorMsg = error.message || "Failed to load images";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAssets();
    } else {
      setError("");
      setSuccess("");
      setSearchTerm("");
      setSelectedImage("");
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
      const result = await StorageService.uploadImageWithPreview(file);
      await loadAssets();
      setSuccess("✅ Image uploaded successfully!");
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

  const _handlePreviewImage = (url: string) => {
    window.open(url, "_blank");
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

  const ImageThumbnail = ({
    asset,
    isSelected,
  }: {
    asset: StorageFile;
    isSelected: boolean;
  }) => {
    const [imageState, setImageState] = useState<
      "loading" | "loaded" | "error"
    >("loading");

    return (
      <div
        className={`relative group cursor-pointer rounded-lg overflow-hidden transition-all duration-200 border-2 bg-white shadow-sm hover:shadow-md ${
          isSelected
            ? "border-primary ring-2 ring-primary/20 shadow-lg"
            : "border-gray-200 hover:border-primary/50"
        }`}
        onClick={() => setSelectedImage(asset.url)}
      >
        {/* Fixed aspect ratio container */}
        <div className="relative w-full pb-[100%]">
          {imageState === "loading" && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {isImage(asset.name) ? (
            <img
              src={asset.url}
              alt={asset.name}
              className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
              onLoad={() => setImageState("loaded")}
              onError={() => setImageState("error")}
            />
          ) : (
            <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center">
              <FileImage className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-xs text-muted-foreground text-center px-2 font-sans">
                {asset.name}
              </span>
            </div>
          )}

          {imageState === "error" && (
            <div className="absolute inset-0 bg-red-50 flex flex-col items-center justify-center">
              <AlertCircle className="h-6 w-6 text-destructive mb-1" />
              <span className="text-xs text-destructive font-sans">
                Failed to load
              </span>
            </div>
          )}

          {/* Hover overlay with buttons */}
          {/* <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white hover:bg-gray-100 text-gray-900 font-heading"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreviewImage(asset.url);
                }}
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageSelect(asset.url);
                }}
              >
                <CheckCircle className="h-3 w-3" />
              </Button>
            </div>
          </div> */}

          {/* File info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm text-gray-900 text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity border-t border-gray-200">
            <div className="truncate font-heading font-medium">
              {asset.name}
            </div>
            {asset.size && (
              <div className="text-xs text-gray-600 font-sans">
                {(asset.size / 1024).toFixed(1)} KB
              </div>
            )}
          </div>

          {/* Selection indicator */}
          {isSelected && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-lg">
              <CheckCircle className="h-3 w-3" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] overflow-auto bg-white border-gray-200 shadow-2xl">
        <DialogHeader className="border-b border-gray-200 pb-4 bg-white">
          <DialogTitle className="flex items-center space-x-3 text-gray-900 font-heading">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <ImageIcon className="h-4 w-4 text-primary" />
            </div>
            <span>Select or Upload Image</span>
            <Badge
              variant="outline"
              className="font-heading bg-gray-50 text-gray-700 border-gray-200"
            >
              {filteredAssets.length} available
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full bg-white">
          {/* Alerts */}
          {error && (
            <Alert
              variant="destructive"
              className="bg-red-50 border-red-200 mb-4"
            >
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="font-sans font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-emerald-200 bg-emerald-50 mb-4">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <AlertDescription className="text-emerald-800 font-sans font-medium">
                {success}
              </AlertDescription>
            </Alert>
          )}

          <Tabs
            defaultValue="gallery"
            className="flex-1 flex flex-col bg-white"
          >
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 mb-4">
              <TabsTrigger
                value="gallery"
                className="flex items-center space-x-2 font-heading"
              >
                <ImageIcon className="h-4 w-4" />
                <span>Gallery</span>
                <Badge variant="outline" className="ml-1 font-heading bg-white">
                  {filteredAssets.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="upload"
                className="flex items-center space-x-2 font-heading"
              >
                <Upload className="h-4 w-4" />
                <span>Upload New</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="gallery"
              className="flex-1 flex flex-col bg-white min-h-0"
            >
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search images by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-300 font-sans"
                />
              </div>

              {/* Gallery content with proper scroll */}
              <div className="flex-1 min-h-0">
                {loading ? (
                  <div className="flex items-center justify-center py-16 bg-white h-full">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                      <span className="text-lg font-heading font-semibold text-gray-900">
                        Loading images...
                      </span>
                      <p className="text-gray-600 font-sans mt-2">
                        Please wait while we fetch your gallery
                      </p>
                    </div>
                  </div>
                ) : filteredAssets.length > 0 ? (
                  <ScrollArea className="h-full rounded-md border border-gray-200">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-4">
                      {filteredAssets.map((asset) => (
                        <ImageThumbnail
                          key={asset.fullPath}
                          asset={asset}
                          isSelected={selectedImage === asset.url}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-16 bg-white h-full flex flex-col justify-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ImageIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">
                      {searchTerm ? "No images found" : "No images available"}
                    </h3>
                    <p className="text-gray-600 font-sans max-w-md mx-auto">
                      {searchTerm
                        ? `No images match "${searchTerm}". Try adjusting your search terms.`
                        : "Upload some images to get started with your gallery."}
                    </p>
                    {searchTerm && (
                      <Button
                        variant="outline"
                        onClick={() => setSearchTerm("")}
                        className="mt-4 font-heading"
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Selection UI */}
              {selectedImage && (
                <div className="border-t border-gray-200 bg-gray-50 p-4 mt-4 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-24 h-24 bg-white border border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={selectedImage}
                          alt="Selected"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-heading font-semibold text-gray-900">
                          Image selected
                        </p>
                        <p className="text-xs text-gray-600 font-mono">
                          {selectedImage.slice(-40)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedImage("")}
                        className="font-heading bg-white"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleImageSelect(selectedImage)}
                        className="bg-primary hover:bg-primary/90 font-heading"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Use This Image
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="upload" className="flex-1 bg-white">
              <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Upload className="h-8 w-8 text-primary" />
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">
                    Upload New Image
                  </h3>
                  <p className="text-gray-600 font-sans mb-4 max-w-md">
                    Choose an image file from your device to add to your gallery
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 font-sans">
                    <span>JPEG, PNG, WebP, GIF, SVG</span>
                    <span>•</span>
                    <span>Max 5MB</span>
                  </div>
                </div>

                <Button
                  onClick={handleUploadClick}
                  disabled={uploading}
                  className="min-w-[160px] font-heading"
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
