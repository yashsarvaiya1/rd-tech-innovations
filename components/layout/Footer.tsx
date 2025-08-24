'use client'
import { useContentStore } from '@/stores/content';
import Link from 'next/link';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const { footer } = useContentStore();
  const pathname = usePathname();

if (!footer || footer.hidden || pathname.startsWith('/admin') || pathname.startsWith('/auth')) return null;

  const logoUrl = footer.logoUrl || footer['footer.logoUrl'] || '';
  const address = footer.address || footer['footer.address'] || '';
  const companyEmail = footer.companyEmail || footer['footer.companyEmail'] || '';
  const text = footer.text || footer['footer.text'] || '';
  const text2 = footer.text2 || footer['footer.text2'] || '';
  const socialLinks = footer.socialLinks || footer['footer.socialLinks'] || [];

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo */}
            {logoUrl && (
              <Link href="/" className="inline-block">
                <img
                  src={logoUrl}
                  alt="Company Logo"
                  className="h-12 w-auto object-contain"
                />
              </Link>
            )}

            {/* Main Text */}
            {text && (
              <p className="text-gray-300 leading-relaxed max-w-md">
                {text}
              </p>
            )}

            {/* Additional Text */}
            {text2 && (
              <p className="text-gray-400 text-sm max-w-md">
                {text2}
              </p>
            )}

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex space-x-4">
                {socialLinks.map((social: any, index: number) => (
                  <motion.a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {social.iconUrl ? (
                      <img
                        src={social.iconUrl}
                        alt={social.name}
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      <ExternalLink className="w-4 h-4" />
                    )}
                  </motion.a>
                ))}
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            
            {companyEmail && (
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <a
                  href={`mailto:${companyEmail}`}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {companyEmail}
                </a>
              </div>
            )}

            {address && (
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <p className="text-gray-300 leading-relaxed">
                  {address}
                </p>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/projects" className="text-gray-300 hover:text-white transition-colors">
                Projects
              </Link>
              <Link href="/career" className="text-gray-300 hover:text-white transition-colors">
                Careers
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} RD Tech Innovations. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
