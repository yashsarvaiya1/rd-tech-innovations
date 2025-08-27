'use client'
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useSectionContent } from '@/stores/content';
import { useSubmissionActions, useSubmissionStatus } from '@/stores/submission';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, MessageCircle, Clock, Users, Building } from 'lucide-react';

export default function ContactUs() {
  // ✅ ALL HOOKS MUST BE CALLED FIRST
  const { data: contactUs, loading: contactLoading, error: contactError } = useSectionContent('contactUs');
  const { data: footer, loading: footerLoading, error: footerError } = useSectionContent('footer');
  const { submitEnquiry, clearMessages } = useSubmissionActions();
  const { loading, error, success, canSubmit, remainingSubmissions } = useSubmissionStatus();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  
  // ✅ Form state with correct field names
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    requirement: ''
  });

  // ✅ GSAP animation effect - Fixed easing
  useEffect(() => {
    if (!isInView || !containerRef.current || contactLoading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo('.contact-title', 
        { y: 80, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }
      )
      .fromTo('.contact-description', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 
        "-=0.6"
      )
      .fromTo('.contact-form', 
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, 
        "-=0.4"
      )
      .fromTo('.contact-info', 
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power2.out" }, 
        "-=0.6"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isInView, contactLoading]);

  // ✅ Cleanup effect
  useEffect(() => {
    return () => {
      clearMessages();
    };
  }, [clearMessages]);

  // ✅ Event handlers
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
  }, [formData, canSubmit, submitEnquiry]);

  // ✅ CONDITIONAL RENDERING AFTER ALL HOOKS
  if (contactLoading || footerLoading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading contact form...</p>
        </div>
      </section>
    );
  }

  if (contactError || !contactUs || contactUs.hidden) return null;

  const title = contactUs.title || '';
  const description = contactUs.description || '';
  const form = contactUs.form || {};

  // ✅ Dynamic form labels from Firestore
  const formLabels = {
    title: form.title || 'Get In Touch',
    about: form.about || 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
    name: form.name || 'Name',
    email: form.email || 'Email',
    number: form.number || 'Phone',
    requirement: form.requirement || 'Message'
  };

  // ✅ Get contact info from footer data
  const contactInfo = {
    email: footer?.companyEmail || 'contact@company.com',
    phone: footer?.number || '+1 (555) 123-4567', // Default until you add phone to footer model
    address: footer?.address || '123 Business Street, City, State 12345'
  };

  if (!title && !description && Object.keys(form).length === 0) return null;

  return (
    <section 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden py-20"
    >
      {/* ✅ Enhanced background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-slate-50/40 to-blue-50/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(99,102,241,0.04),transparent_50%)]" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-200/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* ✅ Enhanced Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          {title && (
            <h2 className="contact-title text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-blue-700 to-slate-900 bg-clip-text text-transparent">
                {title}
              </span>
            </h2>
          )}
          
          {description && (
            <p className="contact-description text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* ✅ Enhanced Contact Form */}
          <motion.div className="contact-form lg:col-span-3">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10 border border-white/60">
              
              {/* Form Header */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-3 flex items-center">
                  <MessageCircle className="w-6 h-6 text-blue-600 mr-3" />
                  {formLabels.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {formLabels.about}
                </p>
              </div>
              
              {/* Daily Limit Warning */}
              {!canSubmit && (
                <div className="mb-6 p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl">
                  <div className="flex items-center space-x-3 text-amber-800">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-bold">Daily Limit Reached</span>
                  </div>
                  <p className="text-amber-700 text-sm mt-2">
                    You've submitted the maximum number of enquiries for today. Please try again tomorrow.
                  </p>
                </div>
              )}

              {/* Remaining Submissions Counter */}
              {canSubmit && remainingSubmissions <= 1 && (
                <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
                  <div className="flex items-center space-x-3 text-blue-800">
                    <Clock className="w-5 h-5" />
                    <span className="font-bold">
                      {remainingSubmissions} submission{remainingSubmissions !== 1 ? 's' : ''} remaining today
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-bold text-slate-700 mb-3">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>{formLabels.name} *</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={loading || !canSubmit}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-slate-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-slate-900"
                      placeholder={`Enter your ${formLabels.name.toLowerCase()}`}
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-bold text-slate-700 mb-3">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span>{formLabels.email} *</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={loading || !canSubmit}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-slate-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-slate-900"
                      placeholder={`Enter your ${formLabels.email.toLowerCase()}`}
                    />
                  </div>
                </div>

                {/* Phone Number Field */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-bold text-slate-700 mb-3">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span>{formLabels.number} *</span>
                  </label>
                  <input
                    type="tel"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    required
                    disabled={loading || !canSubmit}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-slate-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-slate-900"
                    placeholder={`Enter your ${formLabels.number.toLowerCase()}`}
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-bold text-slate-700 mb-3">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                    <span>{formLabels.requirement} *</span>
                  </label>
                  <textarea
                    name="requirement"
                    value={formData.requirement}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    disabled={loading || !canSubmit}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-slate-50 focus:bg-white resize-none disabled:opacity-50 disabled:cursor-not-allowed text-slate-900"
                    placeholder={`Tell us about your ${formLabels.requirement.toLowerCase()}...`}
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading || !canSubmit}
                  whileHover={{ scale: (loading || !canSubmit) ? 1 : 1.02 }}
                  whileTap={{ scale: (loading || !canSubmit) ? 1 : 0.98 }}
                  className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg ${
                    (loading || !canSubmit)
                      ? 'bg-slate-400 cursor-not-allowed shadow-none' 
                      : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 hover:shadow-xl'
                  } text-white`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      <span>{canSubmit ? 'Send Message' : 'Limit Reached'}</span>
                    </>
                  )}
                </motion.button>

                {/* Status Messages */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3 text-green-700 bg-green-50 p-5 rounded-xl border-2 border-green-200"
                  >
                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Message Sent Successfully!</p>
                      <p className="text-sm text-green-600">{success}</p>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3 text-red-700 bg-red-50 p-5 rounded-xl border-2 border-red-200"
                  >
                    <AlertCircle className="w-6 h-6 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Message Failed to Send</p>
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>

          {/* ✅ Enhanced Contact Information - Using Footer Data */}
          <motion.div className="contact-info lg:col-span-2 space-y-6">
            
            {/* Contact Details Card */}
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border border-white/60 shadow-xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <Building className="w-6 h-6 text-blue-600 mr-3" />
                Contact Information
              </h3>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Email Us</h4>
                    <p className="text-slate-600">{contactInfo.email}</p>
                    <p className="text-xs text-slate-500 mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Call Us</h4>
                    <p className="text-slate-600">{contactInfo.phone}</p>
                    <p className="text-xs text-slate-500 mt-1">Mon-Fri 9AM-6PM</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Visit Us</h4>
                    <p className="text-slate-600 leading-relaxed">{contactInfo.address}</p>
                    <p className="text-xs text-slate-500 mt-1">Open Monday to Friday</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Response Card */}
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 mr-3" />
                <h4 className="font-bold text-xl">Quick Response</h4>
              </div>
              <p className="text-blue-100 leading-relaxed mb-4">
                We typically respond to all inquiries within 24 hours. For urgent matters, please call us directly.
              </p>
              <div className="flex items-center text-blue-200 text-sm">
                <Users className="w-4 h-4 mr-2" />
                <span>Our team is ready to help you</span>
              </div>
            </div>
            
          </motion.div>
        </div>
      </div>
    </section>
  );
}
