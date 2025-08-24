'use client'
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useContentStore } from '@/stores/content';
import { useSubmissionActions, useSubmissionStatus } from '@/stores/submission';
import { Upload, Send, CheckCircle, AlertCircle, User, Mail, Phone, FileText, Briefcase, MapPin } from 'lucide-react';

export default function CareerForm() {
  const { career } = useContentStore();
  const { submitCareerApplication, clearMessages } = useSubmissionActions();
  const { loading, error, success, canSubmit, remainingSubmissions } = useSubmissionStatus();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });
  
  // ✅ Form data matching CareerSubmission model exactly
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

  useEffect(() => {
    if (!isInView || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.timeline()
        .from('.career-form-title', { y: 50, opacity: 0, duration: 1, ease: "power2.out" })
        .from('.career-form-content', { y: 30, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.5");
    }, containerRef);

    return () => ctx.revert();
  }, [isInView]);

  // ✅ FIXED: Empty dependency array to prevent infinite cleanup
  useEffect(() => {
    return () => {
      clearMessages();
    };
  }, []);

  if (!career || career.hidden) return null;

  const title = career.title || '';
  const form = career.form || {};

  // Dynamic form field labels from Firestore
  const formLabels = {
    name: form.name || 'Full Name',
    email: form.email || 'Email Address',
    number: form.number || 'Phone Number',
    location: form.location || 'Location',
    portfolioOrLink: form.portfolioOrLink || 'Portfolio/LinkedIn URL',
    ctc: form.ctc || 'Expected CTC',
    about: form.about || 'About Yourself',
    resumeUrl: form.resumeUrl || 'Resume URL',
    positions: form.positions || ['Developer', 'Designer', 'Manager'] // Default options
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handlePositionsChange = useCallback((position: string) => {
    setFormData(prev => ({
      ...prev,
      positions: prev.positions.includes(position)
        ? prev.positions.filter(p => p !== position)
        : [...prev.positions, position]
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSubmit) return;

    const success = await submitCareerApplication(formData);
    
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
    }
  }, [formData, canSubmit, submitCareerApplication]);

  if (!title && Object.keys(form).length === 0) return null;

  return (
    <section 
      ref={containerRef}
      className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50 relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12 relative">
        {title && (
          <h2 className="career-form-title text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            {title}
          </h2>
        )}

        <motion.div
          className="career-form-content bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Daily Limit Warning */}
          {!canSubmit && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-center space-x-2 text-amber-800">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">Daily limit reached</span>
              </div>
              <p className="text-amber-700 text-sm mt-1">
                You've reached the daily application limit. Please try again tomorrow.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4" />
                  <span>{formLabels.name} *</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={loading || !canSubmit}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4" />
                  <span>{formLabels.email} *</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading || !canSubmit}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Number */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4" />
                  <span>{formLabels.number} *</span>
                </label>
                <input
                  type="tel"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  required
                  disabled={loading || !canSubmit}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Location */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{formLabels.location} *</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  disabled={loading || !canSubmit}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Portfolio */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {formLabels.portfolioOrLink}
                </label>
                <input
                  type="url"
                  name="portfolioOrLink"
                  value={formData.portfolioOrLink}
                  onChange={handleInputChange}
                  disabled={loading || !canSubmit}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="https://your-portfolio.com"
                />
              </div>

              {/* CTC */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {formLabels.ctc} *
                </label>
                <input
                  type="text"
                  name="ctc"
                  value={formData.ctc}
                  onChange={handleInputChange}
                  required
                  disabled={loading || !canSubmit}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="e.g., 8-12 LPA"
                />
              </div>
            </div>

            {/* Resume URL */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <Upload className="w-4 h-4" />
                <span>{formLabels.resumeUrl} *</span>
              </label>
              <input
                type="url"
                name="resumeUrl"
                value={formData.resumeUrl}
                onChange={handleInputChange}
                required
                disabled={loading || !canSubmit}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="https://drive.google.com/your-resume"
              />
            </div>

            {/* Positions */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Interested Positions *
              </label>
              <div className="flex flex-wrap gap-3">
                {(Array.isArray(formLabels.positions) ? formLabels.positions : ['Developer', 'Designer', 'Manager']).map((position: string) => (
                  <label
                    key={position}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.positions.includes(position)}
                      onChange={() => handlePositionsChange(position)}
                      disabled={loading || !canSubmit}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                    />
                    <span className="text-sm text-gray-700">{position}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* About */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                <span>{formLabels.about} *</span>
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                required
                rows={6}
                disabled={loading || !canSubmit}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Tell us about your experience, skills, and why you'd be a great fit..."
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading || !canSubmit || formData.positions.length === 0}
              whileHover={{ scale: (loading || !canSubmit) ? 1 : 1.02 }}
              whileTap={{ scale: (loading || !canSubmit) ? 1 : 0.98 }}
              className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                (loading || !canSubmit || formData.positions.length === 0)
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
              } text-white`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>{canSubmit ? 'Submit Application' : 'Limit Reached'}</span>
                </>
              )}
            </motion.button>

            {/* Status Messages */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-xl border border-green-200"
              >
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>{success}</span>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-200"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
