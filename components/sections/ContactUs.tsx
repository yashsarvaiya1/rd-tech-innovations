"use client";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import {
  AlertCircle,
  Building,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSectionContent } from "@/stores/content";
import { useSubmissionActions, useSubmissionStatus } from "@/stores/submission";

export default function ContactUs() {
  // ✅ ALL HOOKS MUST BE CALLED FIRST
  const {
    data: contactUs,
    loading: contactLoading,
    error: contactError,
  } = useSectionContent("contactUs");
  const {
    data: footer,
    loading: footerLoading,
    error: footerError,
  } = useSectionContent("footer");
  const { submitEnquiry, clearMessages } = useSubmissionActions();
  const { loading, error, success, canSubmit, remainingSubmissions } =
    useSubmissionStatus();

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  // ✅ Form state with correct field names
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    requirement: "",
  });

  // ✅ GSAP animation effect
  useEffect(() => {
    if (!isInView || !containerRef.current || contactLoading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".contact-title",
        { y: 80, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" },
      )
        .fromTo(
          ".contact-description",
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.6",
        )
        .fromTo(
          ".contact-form",
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
          "-=0.4",
        )
        .fromTo(
          ".contact-info",
          { x: -60, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, ease: "power2.out" },
          "-=0.6",
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
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!canSubmit) return;

      const success = await submitEnquiry(formData);

      if (success) {
        setFormData({
          name: "",
          email: "",
          number: "",
          requirement: "",
        });
      }
    },
    [formData, canSubmit, submitEnquiry],
  );

  // ✅ CONDITIONAL RENDERING AFTER ALL HOOKS
  if (contactLoading || footerLoading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/8 py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg font-sans">
            Loading contact form...
          </p>
        </div>
      </section>
    );
  }

  if (contactError || !contactUs || contactUs.hidden) return null;

  const title = contactUs.title || "";
  const description = contactUs.description || "";
  const form = contactUs.form || {};

  // ✅ Dynamic form labels from Firestore
  const formLabels = {
    title: form.title || "Get In Touch",
    about:
      form.about ||
      "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    name: form.name || "Name",
    email: form.email || "Email",
    number: form.number || "Phone",
    requirement: form.requirement || "Message",
  };

  // ✅ Get contact info from footer data
  const contactInfo = {
    email: footer?.companyEmail || "contact@company.com",
    phone: footer?.number || "+1 (555) 123-4567",
    address: footer?.address || "123 Business Street, City, State 12345",
  };

  if (!title && !description && Object.keys(form).length === 0) return null;

  return (
    <section
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/8 relative overflow-hidden py-28"
    >
      {/* ✅ Enhanced background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-muted/10 to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(39,180,198,0.04),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,20,147,0.03),transparent_60%)]" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* ✅ Enhanced Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          {title && (
            <h2 className="contact-title text-3xl md:text-4xl lg:text-5xl font-heading font-black leading-tight mb-6">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {title}
              </span>
            </h2>
          )}

          {description && (
            <p className="contact-description text-base md:text-lg text-foreground leading-relaxed max-w-2xl mx-auto font-sans font-medium">
              {description}
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* ✅ Enhanced Contact Form */}
          <motion.div className="contact-form lg:col-span-3">
            <div className="bg-card/90 backdrop-blur-lg rounded-xl shadow-2xl p-6 md:p-8 border border-border/60">
              {/* Form Header */}
              <div className="mb-8">
                <h3 className="text-xl font-heading font-bold text-foreground mb-3 flex items-center">
                  <MessageCircle className="w-5 h-5 text-primary mr-3" />
                  {formLabels.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-sans">
                  {formLabels.about}
                </p>
              </div>

              {/* Daily Limit Warning */}
              {!canSubmit && (
                <div className="mb-6 p-4 bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/30 rounded-xl">
                  <div className="flex items-center space-x-3 text-accent">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-heading font-bold">
                      Daily Limit Reached
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-2 font-sans">
                    You've submitted the maximum number of enquiries for today.
                    Please try again tomorrow.
                  </p>
                </div>
              )}

              {/* Remaining Submissions Counter */}
              {canSubmit && remainingSubmissions <= 1 && (
                <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 rounded-xl">
                  <div className="flex items-center space-x-3 text-primary">
                    <Clock className="w-5 h-5" />
                    <span className="font-heading font-bold">
                      {remainingSubmissions} submission
                      {remainingSubmissions !== 1 ? "s" : ""} remaining today
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-heading font-bold text-foreground mb-3">
                      <Users className="w-4 h-4 text-primary" />
                      <span>{formLabels.name} *</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={loading || !canSubmit}
                      className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 bg-background focus:bg-card disabled:opacity-50 disabled:cursor-not-allowed text-foreground font-sans"
                      placeholder={`Enter your ${formLabels.name.toLowerCase()}`}
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-heading font-bold text-foreground mb-3">
                      <Mail className="w-4 h-4 text-primary" />
                      <span>{formLabels.email} *</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={loading || !canSubmit}
                      className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 bg-background focus:bg-card disabled:opacity-50 disabled:cursor-not-allowed text-foreground font-sans"
                      placeholder={`Enter your ${formLabels.email.toLowerCase()}`}
                    />
                  </div>
                </div>

                {/* Phone Number Field */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-heading font-bold text-foreground mb-3">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>{formLabels.number} *</span>
                  </label>
                  <input
                    type="tel"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    required
                    disabled={loading || !canSubmit}
                    className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 bg-background focus:bg-card disabled:opacity-50 disabled:cursor-not-allowed text-foreground font-sans"
                    placeholder={`Enter your ${formLabels.number.toLowerCase()}`}
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-heading font-bold text-foreground mb-3">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <span>{formLabels.requirement} *</span>
                  </label>
                  <textarea
                    name="requirement"
                    value={formData.requirement}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    disabled={loading || !canSubmit}
                    className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 bg-background focus:bg-card resize-none disabled:opacity-50 disabled:cursor-not-allowed text-foreground font-sans"
                    placeholder={`Tell us about your ${formLabels.requirement.toLowerCase()}...`}
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading || !canSubmit}
                  whileHover={{ scale: loading || !canSubmit ? 1 : 1.02 }}
                  whileTap={{ scale: loading || !canSubmit ? 1 : 0.98 }}
                  className={`w-full py-4 px-8 rounded-xl font-heading font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg ${
                    loading || !canSubmit
                      ? "bg-muted cursor-not-allowed shadow-none text-muted-foreground"
                      : "bg-gradient-to-r from-primary to-primary/70 hover:from-primary/90 hover:to-primary/60 hover:shadow-xl text-primary-foreground"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-current border-t-transparent"></div>
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      <span>
                        {canSubmit ? "Send Message" : "Limit Reached"}
                      </span>
                    </>
                  )}
                </motion.button>

                {/* Status Messages */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3 text-primary bg-primary/10 p-4 rounded-xl border border-primary/30"
                  >
                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                    <div>
                      <p className="font-heading font-semibold">
                        Message Sent Successfully!
                      </p>
                      <p className="text-sm text-muted-foreground font-sans">
                        {success}
                      </p>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3 text-accent bg-accent/10 p-4 rounded-xl border border-accent/30"
                  >
                    <AlertCircle className="w-6 h-6 flex-shrink-0" />
                    <div>
                      <p className="font-heading font-semibold">
                        Message Failed to Send
                      </p>
                      <p className="text-sm text-muted-foreground font-sans">
                        {error}
                      </p>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>

          {/* ✅ Enhanced Contact Information */}
          <motion.div className="contact-info lg:col-span-2 space-y-6">
            {/* Contact Details Card */}
            <div className="bg-card/90 backdrop-blur-lg rounded-xl p-6 border border-border/60 shadow-xl">
              <h3 className="text-xl font-heading font-bold text-foreground mb-6 flex items-center">
                <Building className="w-5 h-5 text-primary mr-3" />
                Contact Information
              </h3>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-foreground mb-1">
                      Email Us
                    </h4>
                    <p className="text-muted-foreground font-sans">
                      {contactInfo.email}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-sans">
                      We'll respond within 24 hours
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/70 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-foreground mb-1">
                      Call Us
                    </h4>
                    <p className="text-muted-foreground font-sans">
                      {contactInfo.phone}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-sans">
                      Mon-Fri 9AM-6PM
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/80 to-accent/60 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-foreground mb-1">
                      Visit Us
                    </h4>
                    <p className="text-muted-foreground leading-relaxed font-sans">
                      {contactInfo.address}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-sans">
                      Open Monday to Friday
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Response Card */}
            <div className="bg-gradient-to-br from-primary via-primary/80 to-accent/60 rounded-xl p-6 text-primary-foreground shadow-xl">
              <div className="flex items-center mb-4">
                <Clock className="w-5 h-5 mr-3" />
                <h4 className="font-heading font-bold text-lg">
                  Quick Response
                </h4>
              </div>
              <p className="text-primary-foreground/90 leading-relaxed mb-4 font-sans">
                We typically respond to all inquiries within 24 hours. For
                urgent matters, please call us directly.
              </p>
              <div className="flex items-center text-primary-foreground/80 text-sm">
                <Users className="w-4 h-4 mr-2" />
                <span className="font-sans">Our team is ready to help you</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
