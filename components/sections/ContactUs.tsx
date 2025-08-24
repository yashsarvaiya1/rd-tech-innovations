'use client'
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useContentStore } from '@/stores/content';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactUs() {
  const { contactUs } = useContentStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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

  if (!contactUs || contactUs.hidden) return null;

  const title = contactUs.title || '';
  const description = contactUs.description || '';
  const form = contactUs.form || {};

  // Default form field labels
  const formLabels = {
    name: form.name || 'Full Name',
    email: form.email || 'Email Address',
    phone: form.phone || 'Phone Number',
    company: form.company || 'Company Name',
    message: form.message || 'Your Message'
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call - replace with your actual submission logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form and show success
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
      });
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
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
          <motion.div 
            className="contact-form"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {formLabels.name}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder={`Enter your ${formLabels.name.toLowerCase()}`}
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {formLabels.email}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder={`Enter your ${formLabels.email.toLowerCase()}`}
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {formLabels.phone}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder={`Enter your ${formLabels.phone.toLowerCase()}`}
                  />
                </div>

                {/* Company Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {formLabels.company}
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder={`Enter your ${formLabels.company.toLowerCase()}`}
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {formLabels.message}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                    placeholder={`Enter your ${formLabels.message.toLowerCase()}`}
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                  } text-white`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-xl"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Message sent successfully! We'll get back to you soon.</span>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span>Failed to send message. Please try again.</span>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div 
            className="contact-info space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
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

            {/* Response Time Info */}
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
