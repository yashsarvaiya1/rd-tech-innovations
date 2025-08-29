"use client";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import {
  AlertCircle,
  Briefcase,
  CheckCircle,
  ChevronDown,
  FileText,
  Mail,
  MapPin,
  Phone,
  Send,
  Upload,
  User,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { StorageService } from "@/services/storageService";
import { useSectionContent } from "@/stores/content";
import { useSubmissionActions, useSubmissionStatus } from "@/stores/submission";

export default function CareerForm() {
  // ✅ ALL HOOKS MUST BE CALLED FIRST - NO EARLY RETURNS BEFORE HOOKS
  const {
    data: career,
    loading: contentLoading,
    error: contentError,
  } = useSectionContent("career");
  const {
    data: jobOpening,
    loading: jobLoading,
    error: jobError,
  } = useSectionContent("jobOpening");
  const { submitCareerApplication, clearMessages } = useSubmissionActions();
  const { loading, error, success, canSubmit, remainingSubmissions } =
    useSubmissionStatus();

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  // ✅ Initialize state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    location: "",
    portfolioOrLink: "",
    ctc: "",
    about: "",
    resumeUrl: "",
    positions: [] as string[],
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ✅ ALL useEffect HOOKS
  useEffect(() => {
    if (!isInView || !containerRef.current || contentLoading || !career) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".career-title",
        { y: 60, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
      ).fromTo(
        ".career-form",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.5",
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isInView, contentLoading, career]);

  useEffect(() => {
    return () => {
      clearMessages();
    };
  }, [clearMessages]);

  // ✅ ALL CALLBACKS
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        const file = e.target.files[0];

        const allowedTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (!allowedTypes.includes(file.type)) {
          alert("Please upload only PDF, DOC, or DOCX files");
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          alert("File size must be less than 5MB");
          return;
        }

        setResumeFile(file);
      }
    },
    [],
  );

  const handlePositionSelect = useCallback((position: string) => {
    setFormData((prev) => ({
      ...prev,
      positions: [position], // Single position only
    }));
    setIsDropdownOpen(false);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!canSubmit) return;

      if (formData.positions.length === 0) {
        alert("Please select a position");
        return;
      }

      try {
        setIsUploading(true);

        let resumeUrl = formData.resumeUrl;

        if (resumeFile) {
          resumeUrl = await StorageService.uploadPDF(resumeFile);
        }

        if (!resumeUrl) {
          alert("Please upload your resume or provide a URL");
          return;
        }

        const success = await submitCareerApplication({
          ...formData,
          resumeUrl,
        });

        if (success) {
          setFormData({
            name: "",
            email: "",
            number: "",
            location: "",
            portfolioOrLink: "",
            ctc: "",
            about: "",
            resumeUrl: "",
            positions: [],
          });
          setResumeFile(null);
        }
      } catch (error) {
        console.error("Submission error:", error);
        alert("Failed to submit application. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [formData, resumeFile, canSubmit, submitCareerApplication],
  );

  // ✅ CONDITIONAL RENDERING AFTER ALL HOOKS
  if (contentLoading || jobLoading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/8 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-primary border-t-transparent mx-auto mb-3"></div>
          <p className="text-muted-foreground text-sm font-sans">
            Loading career form...
          </p>
        </div>
      </section>
    );
  }

  if (contentError || jobError || !career || career.hidden) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/8 py-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-sm font-sans">
            Career form is not available
          </p>
        </div>
      </section>
    );
  }

  const title = career.title || "";
  const form = career.form || {};

  if (!title && Object.keys(form).length === 0) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/8 py-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-sm font-sans">
            No career form configured
          </p>
        </div>
      </section>
    );
  }

  // ✅ Get available job positions from jobOpening data
  const availableJobTitles =
    jobOpening?.cards?.map((job: any) => job.title).filter(Boolean) || [];

  // ✅ Dynamic form field labels
  const formLabels = {
    name: form.name || "Name",
    email: form.email || "Email",
    number: form.number || "Phone",
    location: form.location || "Location",
    portfolioOrLink: form.portfolioOrLink || "Portfolio/LinkedIn",
    ctc: form.ctc || "Expected CTC",
    candidateAbout: form.candidateAbout || "About Yourself",
    resumeUrl: form.resumeUrl || "Resume",
    positions:
      availableJobTitles.length > 0
        ? availableJobTitles
        : ["No positions available"],
  };

  return (
    <section
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/8 relative overflow-hidden py-16"
    >
      {/* Enhanced background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-muted/10 to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(39,180,198,0.04),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,20,147,0.03),transparent_60%)]" />
      </div>

      <div className="max-w-3xl mx-auto px-4 lg:px-6 relative z-10">
        {/* ✅ Header */}
        {title && (
          <div className="text-center mb-8">
            <h2 className="career-title text-3xl md:text-4xl lg:text-5xl font-heading font-black leading-tight mb-4">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {title}
              </span>
            </h2>

            {/* {form.title && form.title !== title && (
              <h3 className="text-base font-heading font-bold text-foreground mb-3">{form.title}</h3>
            )} */}

            {form.about && (
              <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed font-sans">
                {form.about}
              </p>
            )}
          </div>
        )}

        {/* ✅ Compact Form Container */}
        <motion.div
          className="career-form bg-card/90 backdrop-blur-lg rounded-xl shadow-xl p-6 md:p-8 border border-border/60"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Daily Limit Warning - Compact */}
          {!canSubmit && (
            <div className="mb-6 p-4 bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/30 rounded-xl">
              <div className="flex items-center space-x-2 text-accent">
                <AlertCircle className="w-4 h-4" />
                <span className="font-heading font-bold text-sm">
                  Daily Limit Reached
                </span>
              </div>
              <p className="text-muted-foreground text-xs mt-1 font-sans">
                You've submitted the maximum applications for today. Try again
                tomorrow.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name & Email */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-1.5 text-xs font-heading font-bold text-foreground mb-2">
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span>{formLabels.name} *</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={loading || !canSubmit || isUploading}
                  className="w-full px-3 py-2.5 border border-border rounded-lg focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all duration-200 bg-background focus:bg-card disabled:opacity-50 text-sm text-foreground font-sans"
                  placeholder={`Enter your ${formLabels.name.toLowerCase()}`}
                />
              </div>

              <div>
                <label className="flex items-center space-x-1.5 text-xs font-heading font-bold text-foreground mb-2">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span>{formLabels.email} *</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading || !canSubmit || isUploading}
                  className="w-full px-3 py-2.5 border border-border rounded-lg focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all duration-200 bg-background focus:bg-card disabled:opacity-50 text-sm text-foreground font-sans"
                  placeholder={`Enter your ${formLabels.email.toLowerCase()}`}
                />
              </div>
            </div>

            {/* Phone & Location */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-1.5 text-xs font-heading font-bold text-foreground mb-2">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span>{formLabels.number} *</span>
                </label>
                <input
                  type="tel"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  required
                  disabled={loading || !canSubmit || isUploading}
                  className="w-full px-3 py-2.5 border border-border rounded-lg focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all duration-200 bg-background focus:bg-card disabled:opacity-50 text-sm text-foreground font-sans"
                  placeholder={`Enter your ${formLabels.number.toLowerCase()}`}
                />
              </div>

              <div>
                <label className="flex items-center space-x-1.5 text-xs font-heading font-bold text-foreground mb-2">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>{formLabels.location} *</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  disabled={loading || !canSubmit || isUploading}
                  className="w-full px-3 py-2.5 border border-border rounded-lg focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all duration-200 bg-background focus:bg-card disabled:opacity-50 text-sm text-foreground font-sans"
                  placeholder={`Enter your ${formLabels.location.toLowerCase()}`}
                />
              </div>
            </div>

            {/* Portfolio & CTC */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-1.5 text-xs font-heading font-bold text-foreground mb-2">
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  <span>{formLabels.portfolioOrLink}</span>
                </label>
                <input
                  type="url"
                  name="portfolioOrLink"
                  value={formData.portfolioOrLink}
                  onChange={handleInputChange}
                  disabled={loading || !canSubmit || isUploading}
                  className="w-full px-3 py-2.5 border border-border rounded-lg focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all duration-200 bg-background focus:bg-card disabled:opacity-50 text-sm text-foreground font-sans"
                  placeholder="https://portfolio.com or LinkedIn"
                />
              </div>

              <div>
                <label className="flex items-center space-x-1.5 text-xs font-heading font-bold text-foreground mb-2">
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  <span>{formLabels.ctc} *</span>
                </label>
                <input
                  type="text"
                  name="ctc"
                  value={formData.ctc}
                  onChange={handleInputChange}
                  required
                  disabled={loading || !canSubmit || isUploading}
                  className="w-full px-3 py-2.5 border border-border rounded-lg focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all duration-200 bg-background focus:bg-card disabled:opacity-50 text-sm text-foreground font-sans"
                  placeholder="e.g., 8-12 LPA"
                />
              </div>
            </div>

            {/* ✅ Position Dropdown */}
            <div>
              <label className="flex items-center space-x-1.5 text-xs font-heading font-bold text-foreground mb-2">
                <Briefcase className="w-3.5 h-3.5 text-primary" />
                <span>Position *</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  disabled={
                    loading ||
                    !canSubmit ||
                    isUploading ||
                    availableJobTitles.length === 0
                  }
                  className="w-full px-3 py-2.5 border border-border rounded-lg focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all duration-200 bg-background focus:bg-card disabled:opacity-50 text-sm text-foreground font-sans text-left flex items-center justify-between"
                >
                  <span>{formData.positions[0] || "Select position"}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isDropdownOpen && availableJobTitles.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg">
                    {availableJobTitles.map((jobTitle: string) => (
                      <button
                        key={jobTitle}
                        type="button"
                        onClick={() => handlePositionSelect(jobTitle)}
                        className="w-full px-3 py-2.5 text-left text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg font-sans"
                      >
                        {jobTitle}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {availableJobTitles.length === 0 && (
                <p className="text-xs text-accent mt-1 font-sans">
                  No positions available at the moment
                </p>
              )}
            </div>

            {/* Resume Upload - Compact */}
            <div>
              <label className="flex items-center space-x-1.5 text-xs font-heading font-bold text-foreground mb-2">
                <Upload className="w-3.5 h-3.5 text-primary" />
                <span>{formLabels.resumeUrl} *</span>
              </label>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                disabled={loading || !canSubmit || isUploading}
                className="w-full px-3 py-2.5 border border-dashed border-border rounded-lg focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all duration-200 bg-background focus:bg-card disabled:opacity-50 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-primary/10 file:text-primary file:text-xs file:font-medium hover:file:bg-primary/20 text-sm font-sans"
              />

              {resumeFile && (
                <div className="mt-2 flex items-center space-x-2 text-xs text-muted-foreground">
                  <FileText className="w-3 h-3" />
                  <span className="font-medium font-sans">
                    {resumeFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setResumeFile(null)}
                    className="text-accent hover:text-accent/80"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              <p className="text-xs text-muted-foreground mt-1 font-sans">
                PDF, DOC, or DOCX (max 5MB)
              </p>
            </div>

            {/* ✅ About */}
            <div>
              <label className="flex items-center space-x-1.5 text-xs font-heading font-bold text-foreground mb-2">
                <FileText className="w-3.5 h-3.5 text-primary" />
                <span>{formLabels.candidateAbout} *</span>
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                required
                rows={4}
                disabled={loading || !canSubmit || isUploading}
                className="w-full px-3 py-2.5 border border-border rounded-lg focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all duration-200 bg-background focus:bg-card resize-none disabled:opacity-50 text-sm text-foreground font-sans"
                placeholder="Tell us about your experience, skills, and why you'd be perfect for this role..."
              />
            </div>

            {/* ✅ Compact Submit Button */}
            <motion.button
              type="submit"
              disabled={
                loading ||
                !canSubmit ||
                isUploading ||
                formData.positions.length === 0 ||
                (!resumeFile && !formData.resumeUrl)
              }
              whileHover={{
                scale: loading || !canSubmit || isUploading ? 1 : 1.01,
              }}
              whileTap={{
                scale: loading || !canSubmit || isUploading ? 1 : 0.99,
              }}
              className={`w-full py-3 px-6 rounded-lg font-heading font-bold text-sm transition-all duration-300 flex items-center justify-center space-x-2 shadow-md ${
                loading ||
                !canSubmit ||
                isUploading ||
                formData.positions.length === 0 ||
                (!resumeFile && !formData.resumeUrl)
                  ? "bg-muted cursor-not-allowed shadow-none text-muted-foreground"
                  : "bg-gradient-to-r from-primary to-primary/70 hover:from-primary/90 hover:to-primary/60 hover:shadow-lg text-primary-foreground"
              }`}
            >
              {loading || isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                  <span>{isUploading ? "Uploading..." : "Submitting..."}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Application</span>
                </>
              )}
            </motion.button>

            {/* Status Messages */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-primary bg-primary/10 p-4 rounded-lg border border-primary/30"
              >
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <div>
                  <p className="font-heading font-semibold text-sm">
                    Application Submitted!
                  </p>
                  <p className="text-xs text-muted-foreground font-sans">
                    {success}
                  </p>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-accent bg-accent/10 p-4 rounded-lg border border-accent/30"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <div>
                  <p className="font-heading font-semibold text-sm">
                    Submission Failed
                  </p>
                  <p className="text-xs text-muted-foreground font-sans">
                    {error}
                  </p>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
