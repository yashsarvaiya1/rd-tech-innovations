'use client'
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useContentStore } from '@/stores/content';
import { Upload, Send, CheckCircle, AlertCircle, User, Mail, Phone, FileText, Briefcase } from 'lucide-react';

export default function CareerForm() {
  const { career } = useContentStore();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    portfolio: '',
    coverLetter: '',
    resume: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!career || career.hidden) return null;

  const form = career.form || {};
  
  // Dynamic form field labels from Firestore
  const formLabels = {
    fullName: form.fullName || 'Full Name',
    email: form.email || 'Email Address',
    phone: form.phone || 'Phone Number',
    position: form.position || 'Position Applied For',
    experience: form.experience || 'Years of Experience',
    portfolio: form.portfolio || 'Portfolio/LinkedIn URL',
    coverLetter: form.coverLetter || 'Cover Letter',
    resume: form.resume || 'Upload Resume'
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, resume: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          submitData.append(key, value);
        }
      });

      // Simulate API call - replace with your actual submission logic
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Reset form and show success
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        portfolio: '',
        coverLetter: '',
        resume: null
      });
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Team</h2>
            <p className="text-gray-600">We're always looking for talented individuals to join our growing team.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4" />
                  <span>{formLabels.fullName}</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder={`Enter your ${formLabels.fullName.toLowerCase()}`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4" />
                  <span>{formLabels.email}</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder={`Enter your ${formLabels.email.toLowerCase()}`}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Phone */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4" />
                  <span>{formLabels.phone}</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder={`Enter your ${formLabels.phone.toLowerCase()}`}
                />
              </div>

              {/* Position */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4" />
                  <span>{formLabels.position}</span>
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder={`Enter ${formLabels.position.toLowerCase()}`}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Experience */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {formLabels.experience}
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                >
                  <option value="">Select experience</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              {/* Portfolio */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {formLabels.portfolio}
                </label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="https://your-portfolio.com"
                />
              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <Upload className="w-4 h-4" />
                <span>{formLabels.resume}</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  name="resume"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                />
                <div className="mt-2 text-xs text-gray-500">
                  Supported formats: PDF, DOC, DOCX (Max 5MB)
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                <span>{formLabels.coverLetter}</span>
              </label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                placeholder="Tell us why you'd be a great fit for this position..."
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
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
              } text-white`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Application</span>
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
                <span>Application submitted successfully! We'll review it and get back to you soon.</span>
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl"
              >
                <AlertCircle className="w-5 h-5" />
                <span>Failed to submit application. Please try again.</span>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
