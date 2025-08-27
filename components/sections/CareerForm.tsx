'use client'
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useSectionContent } from '@/stores/content';
import { useSubmissionActions, useSubmissionStatus } from '@/stores/submission';
import { Upload, Send, CheckCircle, AlertCircle, User, Mail, Phone, FileText, Briefcase, MapPin, X, ChevronDown } from 'lucide-react';
import { StorageService } from '@/services/storageService';

export default function CareerForm() {
  // ✅ ALL HOOKS MUST BE CALLED FIRST - NO EARLY RETURNS BEFORE HOOKS
  const { data: career, loading: contentLoading, error: contentError } = useSectionContent('career');
  const { data: jobOpening, loading: jobLoading, error: jobError } = useSectionContent('jobOpening');
  const { submitCareerApplication, clearMessages } = useSubmissionActions();
  const { loading, error, success, canSubmit, remainingSubmissions } = useSubmissionStatus();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  
  // ✅ Initialize state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    location: '',
    portfolioOrLink: '',
    ctc: '',
    about: '',
    resumeUrl: '',
    positions: [] as string[]
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ✅ ALL useEffect HOOKS - Fixed GSAP easing
  useEffect(() => {
    if (!isInView || !containerRef.current || contentLoading || !career) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      // ✅ Fixed GSAP easing - use string format
      tl.fromTo('.career-title', 
        { y: 60, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
      )
      .fromTo('.career-form', 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 
        "-=0.5"
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
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload only PDF, DOC, or DOCX files');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setResumeFile(file);
    }
  }, []);

  const handlePositionSelect = useCallback((position: string) => {
    setFormData(prev => ({
      ...prev,
      positions: [position] // Single position only
    }));
    setIsDropdownOpen(false);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSubmit) return;

    if (formData.positions.length === 0) {
      alert('Please select a position');
      return;
    }

    try {
      setIsUploading(true);

      let resumeUrl = formData.resumeUrl;
      
      if (resumeFile) {
        resumeUrl = await StorageService.uploadPDF(resumeFile);
      }

      if (!resumeUrl) {
        alert('Please upload your resume or provide a URL');
        return;
      }

      const success = await submitCareerApplication({
        ...formData,
        resumeUrl
      });

      if (success) {
        setFormData({
          name: '',
          email: '',
          number: '',
          location: '',
          portfolioOrLink: '',
          ctc: '',
          about: '',
          resumeUrl: '',
          positions: []
        });
        setResumeFile(null);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [formData, resumeFile, canSubmit, submitCareerApplication]);

  // ✅ CONDITIONAL RENDERING AFTER ALL HOOKS
  if (contentLoading || jobLoading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-blue-600 border-t-transparent mx-auto mb-3"></div>
          <p className="text-slate-600 text-sm">Loading career form...</p>
        </div>
      </section>
    );
  }

  if (contentError || jobError || !career || career.hidden) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 py-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 text-sm">Career form is not available</p>
        </div>
      </section>
    );
  }

  const title = career.title || '';
  const form = career.form || {};

  if (!title && Object.keys(form).length === 0) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 py-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 text-sm">No career form configured</p>
        </div>
      </section>
    );
  }

  // ✅ Get available job positions from jobOpening data
  const availableJobTitles = jobOpening?.cards?.map((job: any) => job.title).filter(Boolean) || [];
  
  // ✅ Dynamic form field labels - Fixed about field
  const formLabels = {
    name: form.name || 'Name',
    email: form.email || 'Email',
    number: form.number || 'Phone',
    location: form.location || 'Location',
    portfolioOrLink: form.portfolioOrLink || 'Portfolio/LinkedIn',
    ctc: form.ctc || 'Expected CTC',
    candidateAbout: form.candidateAbout || 'About Yourself',
    resumeUrl: form.resumeUrl || 'Resume',
    positions: availableJobTitles.length > 0 ? availableJobTitles : ['No positions available']
  };

  return (
    <section 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden py-16"
    >
      {/* Enhanced background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-slate-50/40 to-blue-50/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(99,102,241,0.03),transparent_50%)]" />
      </div>

      <div className="max-w-3xl mx-auto px-4 lg:px-6 relative z-10">
        {/* ✅ Header - REMOVED STATIC "Apply for" TEXT */}
        {title && (
          <div className="text-center mb-8">
            <h2 className="career-title text-2xl md:text-3xl lg:text-4xl font-black leading-tight mb-4">
              <span className="bg-gradient-to-r from-slate-900 via-blue-700 to-slate-900 bg-clip-text text-transparent">
                {title}
              </span>
            </h2>
            
            {form.title && form.title !== title && (
              <h3 className="text-lg font-bold text-slate-800 mb-3">{form.title}</h3>
            )}
            
            {form.about && (
              <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">{form.about}</p>
            )}
          </div>
        )}

        {/* ✅ Compact Form Container */}
        <motion.div
          className="career-form bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 md:p-8 border border-white/60"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Daily Limit Warning - Compact */}
          {!canSubmit && (
            <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
              <div className="flex items-center space-x-2 text-amber-800">
                <AlertCircle className="w-4 h-4" />
                <span className="font-bold text-sm">Daily Limit Reached</span>
              </div>
              <p className="text-amber-700 text-xs mt-1">
                You've submitted the maximum applications for today. Try again tomorrow.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name & Email */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 mb-2">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>{formLabels.name} *</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={loading || !canSubmit || isUploading}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-slate-50 focus:bg-white disabled:opacity-50 text-sm text-slate-900"
                  placeholder={`Enter your ${formLabels.name.toLowerCase()}`}
                />
              </div>

              <div>
                <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 mb-2">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>{formLabels.email} *</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading || !canSubmit || isUploading}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-slate-50 focus:bg-white disabled:opacity-50 text-sm text-slate-900"
                  placeholder={`Enter your ${formLabels.email.toLowerCase()}`}
                />
              </div>
            </div>

            {/* Phone & Location */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 mb-2">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>{formLabels.number} *</span>
                </label>
                <input
                  type="tel"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  required
                  disabled={loading || !canSubmit || isUploading}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-slate-50 focus:bg-white disabled:opacity-50 text-sm text-slate-900"
                  placeholder={`Enter your ${formLabels.number.toLowerCase()}`}
                />
              </div>

              <div>
                <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>{formLabels.location} *</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  disabled={loading || !canSubmit || isUploading}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-slate-50 focus:bg-white disabled:opacity-50 text-sm text-slate-900"
                  placeholder={`Enter your ${formLabels.location.toLowerCase()}`}
                />
              </div>
            </div>

            {/* Portfolio & CTC */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 mb-2">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  <span>{formLabels.portfolioOrLink}</span>
                </label>
                <input
                  type="url"
                  name="portfolioOrLink"
                  value={formData.portfolioOrLink}
                  onChange={handleInputChange}
                  disabled={loading || !canSubmit || isUploading}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-slate-50 focus:bg-white disabled:opacity-50 text-sm text-slate-900"
                  placeholder="https://portfolio.com or LinkedIn"
                />
              </div>

              <div>
                <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 mb-2">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  <span>{formLabels.ctc} *</span>
                </label>
                <input
                  type="text"
                  name="ctc"
                  value={formData.ctc}
                  onChange={handleInputChange}
                  required
                  disabled={loading || !canSubmit || isUploading}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-slate-50 focus:bg-white disabled:opacity-50 text-sm text-slate-900"
                  placeholder="e.g., 8-12 LPA"
                />
              </div>
            </div>

            {/* ✅ Position Dropdown - REMOVED NUMBER COUNT */}
            <div>
              <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 mb-2">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                <span>Position *</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  disabled={loading || !canSubmit || isUploading || availableJobTitles.length === 0}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-slate-50 focus:bg-white disabled:opacity-50 text-sm text-slate-900 text-left flex items-center justify-between"
                >
                  <span>{formData.positions[0] || 'Select position'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && availableJobTitles.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg">
                    {availableJobTitles.map((jobTitle: string) => (
                      <button
                        key={jobTitle}
                        type="button"
                        onClick={() => handlePositionSelect(jobTitle)}
                        className="w-full px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {jobTitle}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {availableJobTitles.length === 0 && (
                <p className="text-xs text-red-500 mt-1">No positions available at the moment</p>
              )}
            </div>

            {/* Resume Upload - Compact */}
            <div>
              <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 mb-2">
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>{formLabels.resumeUrl} *</span>
              </label>
              
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                disabled={loading || !canSubmit || isUploading}
                className="w-full px-3 py-2.5 border border-dashed border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-slate-50 focus:bg-white disabled:opacity-50 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 file:text-xs file:font-medium hover:file:bg-blue-100 text-sm"
              />
              
              {resumeFile && (
                <div className="mt-2 flex items-center space-x-2 text-xs text-slate-600">
                  <FileText className="w-3 h-3" />
                  <span className="font-medium">{resumeFile.name}</span>
                  <button
                    type="button"
                    onClick={() => setResumeFile(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              <p className="text-xs text-slate-500 mt-1">
                PDF, DOC, or DOCX (max 5MB)
              </p>
            </div>

            {/* ✅ About */}
            <div>
              <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 mb-2">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>{formLabels.candidateAbout} *</span>
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                required
                rows={4}
                disabled={loading || !canSubmit || isUploading}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-slate-50 focus:bg-white resize-none disabled:opacity-50 text-sm text-slate-900"
                placeholder="Tell us about your experience, skills, and why you'd be perfect for this role..."
              />
            </div>

            {/* ✅ Compact Submit Button */}
            <motion.button
              type="submit"
              disabled={loading || !canSubmit || isUploading || formData.positions.length === 0 || (!resumeFile && !formData.resumeUrl)}
              whileHover={{ scale: loading || !canSubmit || isUploading ? 1 : 1.01 }}
              whileTap={{ scale: loading || !canSubmit || isUploading ? 1 : 0.99 }}
              className={`w-full py-3 px-6 rounded-lg font-bold text-sm transition-all duration-300 flex items-center justify-center space-x-2 shadow-md ${
                (loading || !canSubmit || isUploading || formData.positions.length === 0 || (!resumeFile && !formData.resumeUrl))
                  ? 'bg-slate-400 cursor-not-allowed shadow-none' 
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 hover:shadow-lg'
              } text-white`}
            >
              {loading || isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>{isUploading ? 'Uploading...' : 'Submitting...'}</span>
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
                className="flex items-center space-x-2 text-green-700 bg-green-50 p-4 rounded-lg border border-green-200"
              >
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Application Submitted!</p>
                  <p className="text-xs text-green-600">{success}</p>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-red-700 bg-red-50 p-4 rounded-lg border border-red-200"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Submission Failed</p>
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
