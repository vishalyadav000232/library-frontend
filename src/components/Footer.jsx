import React from "react";
import {
  BookOpen,
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const quickLinks = [
    { name: "Home", path: "/dashboard/home" },
    { name: "Bookings", path: "/dashboard/bookings" },
    { name: "Services", path: "/dashboard/services" },
    { name: "Book a Seat", path: "/dashboard/seats" },
    { name: "My Bookings", path: "/dashboard/my-bookings" },
    { name: "Contact", path: "/dashboard/contact" },
  ];

  const resources = [
    { name: "Library Rules", path: "/rules" },
    { name: "Membership Plans", path: "/membership" },
    { name: "FAQ", path: "/faq" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms & Conditions", path: "/terms" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "#" },
    { name: "Twitter", icon: Twitter, url: "#" },
    { name: "Instagram", icon: Instagram, url: "#" },
    { name: "LinkedIn", icon: Linkedin, url: "#" },
  ];

  return (
    <footer className="bg-gradient-to-b from-amber-900 to-amber-950 text-amber-50 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6">

        {/* Main */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-700 rounded-lg">
                <BookOpen className="w-6 h-6 text-amber-50" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Yadav Library</h3>
                <p className="text-xs text-amber-300">
                  Your Reading Haven
                </p>
              </div>
            </div>

            <p className="text-amber-200 text-sm mb-5 leading-relaxed">
              A premium library and study space designed for students and book
              lovers. Experience comfort, knowledge, and productivity in one place.
            </p>

            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-amber-800 hover:bg-amber-700 rounded-lg flex items-center justify-center transition hover:scale-110"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-amber-200 hover:text-white text-sm transition hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              {resources.map((resource, index) => (
                <li key={index}>
                  <Link
                    to={resource.path}
                    className="text-amber-200 hover:text-white text-sm transition hover:translate-x-1 inline-block"
                  >
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 mt-0.5" />
                <span className="text-amber-200 text-sm leading-relaxed">
                  123 Library Street, Lucknow, Uttar Pradesh, 226001
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-400" />
                <a
                  href="tel:+919876543210"
                  className="text-amber-200 text-sm hover:text-white transition"
                >
                  +91 98765 43210
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-400" />
                <a
                  href="mailto:info@yadavlibrary.com"
                  className="text-amber-200 text-sm hover:text-white transition"
                >
                  info@yadavlibrary.com
                </a>
              </li>

              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 mt-0.5" />
                <div className="text-amber-200 text-sm">
                  <p>Mon - Sun</p>
                  <p className="text-amber-300">
                    6:00 AM - 11:00 PM
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-amber-800 mb-6"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-amber-300">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} Yadav Library. All rights reserved.
          </p>

          <p className="flex items-center gap-1 text-center">
            Made with{" "}
            <Heart className="w-4 h-4 text-red-400 fill-red-400" /> for
            Library lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;