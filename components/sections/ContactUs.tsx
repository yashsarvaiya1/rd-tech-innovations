'use client'
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useContentStore } from '@/stores/content';
import { useSubmissionActions, useSubmissionStatus } from '@/stores/submission';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactUs() {
  // ✅ FIXED: All hooks must be called before any conditional returns
  const { contactUs } = useContentStore();
  const { submitEnquiry, clearMessages } = useSubmissionActions();
  const { loading, error, success, canSubmit, remainingSubmissions } = useSubmissionStatus();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });
  
  // ✅ Form state with correct field names
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',        // ✅ Correct: matches EnquirySubmission.number
    requirement: ''    // ✅ Correct: matches EnquirySubmission.requirement
  });

  // ✅ GSAP animation effect
  useEffect(() => {
    if (!isInView || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.timeline()
        .from('.contact-title', { y: 50, opacity: 0, duration: 1, ease: "power2.out" })
        .from('.contact-description', { y: 30, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.5")
        .from('.contact-form', { y: 40, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.3")
        .from('.contact-info', { x: -40, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.5");
    }, containerRef);

    return () => ctx.revert();
  }, [isInView]);

  // ✅ Cleanup effect
  useEffect(() => {
    return () => {
      clearMessages();
    };
  }, [clearMessages]);

  // ✅ Event handlers - NOT using useCallback to avoid hook ordering issues
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSubmit) return;

    const success = await submitEnquiry(formData);
    
    if (success) {
      setFormData({
        name: '',
        email: '',
        number: '',
        requirement: ''
      });
    }
  };

  // ✅ FIXED: Early return AFTER all hooks have been called
  if (!contactUs || contactUs.hidden) return null;

  const title = contactUs.title || '';
  const description = contactUs.description || '';
  const form = contactUs.form || {};

  const formLabels = {
    name: form.name || 'Full Name',
    email: form.email || 'Email Address',
    number: form.number || 'Phone Number',
    requirement: form.requirement || 'Requirement'
  };

  if (!title && !description && Object.keys(form).length === 0) return null;

  return (
    <section 
      ref={containerRef}
      className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {title && (
            <h2 className="contact-title text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {title}
            </h2>
          )}
          
          {description && (
            <p className="contact-description text-lg md:text-xl text-gray-600 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Form */}
          <motion.div className="contact-form">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              
              {/* Daily Limit Warning */}
              {!canSubmit && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-center space-x-2 text-amber-800">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-semibold">Daily limit reached</span>
                  </div>
                  <p className="text-amber-700 text-sm mt-1">
                    You've reached the daily submission limit. Please try again tomorrow.
                  </p>
                </div>
              )}

              {/* Remaining Submissions Counter */}
              {canSubmit && remainingSubmissions <= 2 && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-blue-800 text-sm">
                    You have {remainingSubmissions} submission{remainingSubmissions !== 1 ? 's' : ''} remaining today.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {formLabels.name} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={loading || !canSubmit}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder={`Enter your ${formLabels.name.toLowerCase()}`}
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {formLabels.email} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={loading || !canSubmit}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder={`Enter your ${formLabels.email.toLowerCase()}`}
                  />
                </div>

                {/* Number Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {formLabels.number} *
                  </label>
                  <input
                    type="tel"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    required
                    disabled={loading || !canSubmit}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder={`Enter your ${formLabels.number.toLowerCase()}`}
                  />
                </div>

                {/* Requirement Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {formLabels.requirement} *
                  </label>
                  <textarea
                    name="requirement"
                    value={formData.requirement}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    disabled={loading || !canSubmit}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder={`Enter your ${formLabels.requirement.toLowerCase()}`}
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading || !canSubmit}
                  whileHover={{ scale: (loading || !canSubmit) ? 1 : 1.02 }}
                  whileTap={{ scale: (loading || !canSubmit) ? 1 : 0.98 }}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    (loading || !canSubmit)
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                  } text-white`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>{canSubmit ? 'Send Message' : 'Limit Reached'}</span>
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
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div className="contact-info space-y-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email Us</h4>
                    <p className="text-gray-600">hello@rdtechinnovations.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Call Us</h4>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Visit Us</h4>
                    <p className="text-gray-600">123 Tech Street, Innovation City, IC 12345</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
              <h4 className="font-bold text-xl mb-4">Quick Response</h4>
              <p className="text-blue-100 leading-relaxed">
                We typically respond to all inquiries within 24 hours. For urgent matters, please call us directly.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
