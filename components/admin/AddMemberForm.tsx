"use client";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Trash2,
  UserPlus,
  Users,
  Mail,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminStore } from "@/stores/admin";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AddMemberForm() {
  const { admins, addAdminEmail, removeAdmin, loading, error, clearError } =
    useAdminStore();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [removeDialog, setRemoveDialog] = useState<{
    open: boolean;
    email: string;
  }>({ open: false, email: "" });
  const [isRemoving, setIsRemoving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) return;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setSuccess("");
      return;
    }

    // Check if email already exists
    if (admins.includes(email.trim().toLowerCase())) {
      setSuccess("");
      return;
    }

    setIsSubmitting(true);
    clearError();
    setSuccess("");

    try {
      await addAdminEmail(email.trim().toLowerCase());
      setEmail("");
      setSuccess(`✅ Administrator ${email} added successfully!`);

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000);
    } catch (error: any) {
      console.error("Error adding admin:", error);
      // Error will be shown via useAdminStore error state
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveAdmin = async () => {
    if (admins.length <= 1) {
      setRemoveDialog({ open: false, email: "" });
      return;
    }

    setIsRemoving(true);
    clearError();
    setSuccess("");

    try {
      await removeAdmin(removeDialog.email);
      setSuccess(`✅ Administrator ${removeDialog.email} removed successfully!`);
      setTimeout(() => setSuccess(""), 5000);
    } catch (error: any) {
      console.error("Error removing admin:", error);
      // Error will be shown via useAdminStore error state
    } finally {
      setIsRemoving(false);
      setRemoveDialog({ open: false, email: "" });
    }
  };

  const openRemoveDialog = (email: string) => {
    setRemoveDialog({ open: true, email });
  };

  const closeRemoveDialog = () => {
    if (!isRemoving) {
      setRemoveDialog({ open: false, email: "" });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-background to-muted/20 p-6 rounded-xl border border-border">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Manage Administrators
          </h1>
        </div>
        <p className="text-muted-foreground font-sans ml-13">
          Add or remove admin users who can access this dashboard
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="font-sans font-medium">{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          <AlertDescription className="font-sans font-medium text-emerald-800">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Add Admin Form */}
      <Card className="bg-white border-border shadow-lg">
        <CardHeader className="bg-muted/30 border-b border-border">
          <CardTitle className="flex items-center text-foreground font-heading">
            <UserPlus className="h-5 w-5 mr-3 text-primary" />
            Add New Administrator
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-card/90">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-heading font-semibold">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  disabled={isSubmitting || loading}
                  className="pl-10 bg-background border-border focus:border-primary font-sans"
                />
              </div>
              {email && !email.includes('@') && (
                <p className="text-sm text-muted-foreground font-sans">
                  Please enter a valid email address
                </p>
              )}
              {email && admins.includes(email.trim().toLowerCase()) && (
                <p className="text-sm text-destructive font-sans">
                  This email is already an administrator
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isSubmitting || loading || !email.trim() || !email.includes('@') || admins.includes(email.trim().toLowerCase())}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding Administrator...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Administrator
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Current Admins List */}
      <Card className="bg-card/90 border-border shadow-lg">
        <CardHeader className="bg-muted/30 border-b border-border">
          <CardTitle className="flex items-center justify-between text-foreground font-heading">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-3 text-primary" />
              Current Administrators
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary font-heading">
              {admins.length} total
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-card/90">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mr-3 text-primary" />
              <span className="font-sans text-muted-foreground">Loading administrators...</span>
            </div>
          ) : admins.length > 0 ? (
            <div className="space-y-4">
              {admins.map((adminEmail, index) => (
                <div
                  key={adminEmail}
                  className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-lg font-heading font-bold text-primary-foreground">
                        {adminEmail.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-base font-heading font-semibold text-foreground">
                        {adminEmail}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="secondary" 
                          className="text-xs bg-primary/10 text-primary"
                        >
                          Administrator
                        </Badge>
                        {index === 0 && (
                          <Badge 
                            variant="outline" 
                            className="text-xs border-accent text-accent"
                          >
                            Primary
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {admins.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openRemoveDialog(adminEmail)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 font-heading"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
              ))}

              {admins.length === 1 && (
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <AlertDescription className="text-amber-800 font-sans">
                    This is the last administrator. At least one admin must remain to manage the system.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                No Administrators
              </h3>
              <p className="text-muted-foreground font-sans">
                Add the first administrator to get started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Remove Admin Confirmation Dialog - SOLID BACKGROUND */}
      <Dialog open={removeDialog.open} onOpenChange={closeRemoveDialog}>
        <DialogContent className="bg-white border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground font-heading flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-destructive" />
              Remove Administrator
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-sans">
              Are you sure you want to remove <strong>{removeDialog.email}</strong> as an administrator? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={closeRemoveDialog}
              disabled={isRemoving}
              className="font-heading"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveAdmin}
              disabled={isRemoving}
              className="font-heading"
            >
              {isRemoving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Admin
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
