"use client";
import {
  AlertCircle,
  CheckCircle,
  Download,
  Eye,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
  FolderOpen,
  FileText,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type StorageFile, StorageService } from "@/services/storageService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AssetsManager() {
  const [assets, setAssets] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    asset: StorageFile | null;
  }>({ open: false, asset: null });
  const [viewDialog, setViewDialog] = useState<{
    open: boolean;
    asset: StorageFile | null;
  }>({ open: false, asset: null });
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadAssets = async () => {
    try {
      setLoading(true);
      setError("");

      const assetsList = await StorageService.listAllAssets();
      setAssets(assetsList);
      
      if (assetsList.length === 0) {
        setSuccess("No assets found. Upload some files to get started!");
      }
    } catch (err: any) {
      setError("Failed to load assets. Please try again.");
      console.error("Error loading assets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleDelete = async () => {
    if (!deleteDialog.asset) return;

    try {
      setDeleting(deleteDialog.asset.fullPath);
      setError("");

      await StorageService.deleteAssetByPath(deleteDialog.asset.fullPath);

      // Remove from local state
      setAssets((prev) => prev.filter((a) => a.fullPath !== deleteDialog.asset!.fullPath));

      setSuccess(`✅ "${deleteDialog.asset.name}" deleted successfully!`);
      setTimeout(() => setSuccess(""), 5000);
    } catch (err: any) {
      setError("Failed to delete asset. Please try again.");
      console.error("Error deleting asset:", err);
    } finally {
      setDeleting(null);
      setDeleteDialog({ open: false, asset: null });
    }
  };

  const openDeleteDialog = (asset: StorageFile) => {
    setDeleteDialog({ open: true, asset });
  };

  const closeDeleteDialog = () => {
    if (!deleting) {
      setDeleteDialog({ open: false, asset: null });
    }
  };

  const openViewDialog = (asset: StorageFile) => {
    setViewDialog({ open: true, asset });
  };

  const closeViewDialog = () => {
    setViewDialog({ open: false, asset: null });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      // You would implement your upload logic here
      // This is a placeholder for the upload functionality
      setSuccess("File upload feature coming soon!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
      // Reset input
      event.target.value = "";
    }
  };

  const isImage = (fileName: string) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    return imageExtensions.some((ext) => fileName.toLowerCase().includes(ext));
  };

  const getFileType = (fileName: string) => {
    if (isImage(fileName)) return "Image";
    if (fileName.toLowerCase().includes(".pdf")) return "PDF";
    if (fileName.toLowerCase().includes(".doc")) return "Document";
    if (fileName.toLowerCase().includes(".mp4")) return "Video";
    return "File";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.fullPath.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-background to-muted/20 p-6 rounded-xl border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">
                Assets Management
              </h1>
              <p className="text-muted-foreground font-sans">
                Manage uploaded files and images
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="font-heading">
              {filteredAssets.length} of {assets.length} files
            </Badge>
            <Button 
              variant="outline" 
              onClick={loadAssets} 
              disabled={loading}
              className="font-heading"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Upload */}
      <Card className="bg-card border-border shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-foreground font-heading font-semibold">
                Search Assets
              </Label>
              <Input
                id="search"
                placeholder="Search by filename or path..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-2 bg-background border-border"
              />
            </div>
            <div className="md:w-auto">
              <Label className="text-foreground font-heading font-semibold">
                Upload New Asset
              </Label>
              <div className="mt-2">
                <Button
                  variant="outline"
                  disabled={uploading}
                  className="w-full md:w-auto font-heading"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </>
                  )}
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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

      {/* Assets Grid */}
      <Card className="bg-card border-border shadow-lg">
        <CardHeader className="bg-muted/30 border-b border-border">
          <CardTitle className="text-foreground font-heading flex items-center">
            <ImageIcon className="h-5 w-5 mr-3 text-primary" />
            Uploaded Assets
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-card/90">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                <span className="text-lg font-heading font-semibold text-muted-foreground">Loading assets...</span>
                <p className="text-sm text-muted-foreground font-sans mt-2">Please wait while we fetch your files</p>
              </div>
            </div>
          ) : filteredAssets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAssets.map((asset) => (
                <Card key={asset.fullPath} className="overflow-hidden bg-background border-border hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-video bg-muted/20 relative group cursor-pointer" onClick={() => openViewDialog(asset)}>
                    {isImage(asset.name) ? (
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <Badge variant="secondary" className="text-xs font-heading">
                            {getFileType(asset.name)}
                          </Badge>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Eye className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3
                        className="font-heading font-semibold text-sm truncate text-foreground"
                        title={asset.name}
                      >
                        {asset.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-sans flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date().toLocaleDateString()} {/* You can add actual date from asset if available */}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openViewDialog(asset)}
                        className="flex-1 font-heading"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild
                        className="font-heading"
                      >
                        <a href={asset.url} download={asset.name}>
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </a>
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDeleteDialog(asset)}
                        disabled={deleting === asset.fullPath}
                        className="font-heading"
                      >
                        {deleting === asset.fullPath ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </div>

                    <div className="text-xs text-muted-foreground break-all font-mono bg-muted/20 p-2 rounded">
                      {asset.fullPath}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                {searchTerm ? "No assets found" : "No Assets Found"}
              </h3>
              <p className="text-muted-foreground font-sans max-w-md mx-auto">
                {searchTerm 
                  ? `No assets match "${searchTerm}". Try adjusting your search terms.`
                  : "Upload some files to see them here. Supported formats: images, PDFs, and documents."
                }
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
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog - SOLID BACKGROUND */}
      <Dialog open={deleteDialog.open} onOpenChange={closeDeleteDialog}>
        <DialogContent className="bg-white border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground font-heading flex items-center">
              <Trash2 className="h-5 w-5 mr-2 text-destructive" />
              Delete Asset
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-sans">
              Are you sure you want to delete <strong>"{deleteDialog.asset?.name}"</strong>? 
              This action cannot be undone and the file will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={closeDeleteDialog}
              disabled={!!deleting}
              className="font-heading"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={!!deleting}
              className="font-heading"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Asset
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Asset Dialog - SOLID BACKGROUND */}
      <Dialog open={viewDialog.open} onOpenChange={closeViewDialog}>
        <DialogContent className="bg-white border-border shadow-2xl max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-foreground font-heading flex items-center">
              <Eye className="h-5 w-5 mr-2 text-primary" />
              View Asset: {viewDialog.asset?.name}
            </DialogTitle>
          </DialogHeader>
          
          {viewDialog.asset && (
            <div className="space-y-4">
              {isImage(viewDialog.asset.name) ? (
                <div className="relative aspect-video bg-muted/20 rounded-lg overflow-hidden">
                  <Image
                    src={viewDialog.asset.url}
                    alt={viewDialog.asset.name}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <Badge variant="secondary" className="font-heading">
                      {getFileType(viewDialog.asset.name)}
                    </Badge>
                  </div>
                </div>
              )}
              
              <div className="bg-muted/20 p-4 rounded-lg font-mono text-sm">
                <p><strong>Path:</strong> {viewDialog.asset.fullPath}</p>
                <p><strong>URL:</strong> <a href={viewDialog.asset.url} target="_blank" className="text-primary hover:underline">{viewDialog.asset.url}</a></p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeViewDialog}
              className="font-heading"
            >
              Close
            </Button>
            {viewDialog.asset && (
              <Button asChild className="font-heading">
                <a href={viewDialog.asset.url} target="_blank">
                  <Eye className="h-4 w-4 mr-2" />
                  Open in New Tab
                </a>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
