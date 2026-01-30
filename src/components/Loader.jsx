import React, { useState } from "react";
import {
  BookOpen,
  Home,
  Calendar,
  Armchair,
  User,
  Menu,
  X,
  Clock,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
} from "lucide-react";

export default function () {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ---------------- NAVIGATION HANDLERS ----------------
  const handleNavigation = (section) => {
    console.log(`Navigate to ${section}`);
    setMobileMenuOpen(false);
  };

  // ---------------- SERVICES DATA ----------------
  const services = [
    {
      icon: BookOpen,
      title: "Vast Collection",
      description: "Access thousands of books across all genres",
      color: "bg-amber-100",
      iconColor: "text-amber-700",
    },
    {
      icon: Armchair,
      title: "Reading Seats",
      description: "Comfortable seating areas for focused study",
      color: "bg-orange-100",
      iconColor: "text-orange-700",
    },
    {
      icon: Calendar,
      title: "Book a Seat",
      description: "Reserve your preferred spot in advance",
      color: "bg-red-100",
      iconColor: "text-red-700",
    },
    {
      icon: Clock,
      title: "Flexible Hours",
      description: "Open 7 days a week for your convenience",
      color: "bg-amber-100",
      iconColor: "text-amber-700",
    },
  ];

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white/95 backdrop-blur shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <BookOpen className="w-8 h-8 text-amber-800" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-amber-900">
                  Yadav Library
                </h1>
                <p className="text-xs text-amber-700">Your Reading Haven</p>
              </div>
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-8">
              <button
                onClick={() => handleNavigation("home")}
                className="text-amber-900 font-medium hover:text-amber-600 transition"
              >
                Home
              </button>
              <button
                onClick={() => handleNavigation("services")}
                className="text-amber-900 font-medium hover:text-amber-600 transition"
              >
                Services
              </button>
              <button
                onClick={() => handleNavigation("bookings")}
                className="text-amber-900 font-medium hover:text-amber-600 transition"
              >
                My Bookings
              </button>
              <button
                onClick={() => handleNavigation("seats")}
                className="text-amber-900 font-medium hover:text-amber-600 transition"
              >
                Book a Seat
              </button>
              <button
                onClick={() => handleNavigation("profile")}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-lg hover:scale-105 transition"
              >
                <User className="w-4 h-4" />
                Profile
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden bg-white/95 backdrop-blur shadow-md sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-amber-800" />
            </div>
            <h1 className="text-xl font-bold text-amber-900">Yadav Library</h1>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-amber-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="bg-white border-t border-amber-200 px-4 py-4 space-y-3">
            <button
              onClick={() => handleNavigation("services")}
              className="w-full text-left text-amber-900 font-medium py-2"
            >
              Services
            </button>
            <button
              onClick={() => handleNavigation("bookings")}
              className="w-full text-left text-amber-900 font-medium py-2"
            >
              My Bookings
            </button>
            <button
              onClick={() => handleNavigation("profile")}
              className="w-full text-left text-amber-900 font-medium py-2"
            >
              Profile
            </button>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6">
              Welcome to Your Study Sanctuary
            </h2>
            <p className="text-lg text-amber-800 mb-8">
              Experience the perfect blend of knowledge and comfort. Reserve
              your seat, explore our vast collection, and make every study
              session productive.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleNavigation("seats")}
                className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition flex items-center gap-2"
              >
                Book a Seat
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleNavigation("services")}
                className="border-2 border-amber-600 text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition"
              >
                Explore
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-amber-200 to-orange-200 rounded-2xl p-8 shadow-2xl">
              <div className="grid grid-cols-3 gap-4">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-amber-700 rounded-lg shadow-md"
                    style={{
                      height: `${Math.random() * 60 + 80}px`,
                      opacity: 0.8,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
              Our Services
            </h3>
            <p className="text-amber-700 text-lg">
              Everything you need for the perfect study experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl shadow-lg hover:scale-105 transition border border-amber-200"
              >
                <div className={`${service.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}>
                  <service.icon className={`w-7 h-7 ${service.iconColor}`} />
                </div>
                <h4 className="text-xl font-bold text-amber-900 mb-2">
                  {service.title}
                </h4>
                <p className="text-amber-700">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-200">
            <MapPin className="w-10 h-10 text-amber-600 mb-4" />
            <h4 className="text-xl font-bold text-amber-900 mb-2">Location</h4>
            <p className="text-amber-700">
              123 Library Street, Lucknow, Uttar Pradesh
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-200">
            <Clock className="w-10 h-10 text-amber-600 mb-4" />
            <h4 className="text-xl font-bold text-amber-900 mb-2">Hours</h4>
            <p className="text-amber-700">Mon - Sun: 6:00 AM - 11:00 PM</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-200">
            <Phone className="w-10 h-10 text-amber-600 mb-4" />
            <h4 className="text-xl font-bold text-amber-900 mb-2">Contact</h4>
            <p className="text-amber-700">+91 98765 43210</p>
          </div>
        </div>
      </section>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-amber-200 shadow-2xl z-50">
        <div className="grid grid-cols-4 gap-1">
          <button
            onClick={() => handleNavigation("home")}
            className="flex flex-col items-center py-3 text-amber-600"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Home</span>
          </button>

          <button
            onClick={() => handleNavigation("bookings")}
            className="flex flex-col items-center py-3 text-amber-700"
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Bookings</span>
          </button>

          <button
            onClick={() => handleNavigation("seats")}
            className="flex flex-col items-center py-3 text-amber-700"
          >
            <Armchair className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Seats</span>
          </button>

          <button
            onClick={() => handleNavigation("profile")}
            className="flex flex-col items-center py-3 text-amber-700"
          >
            <User className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Profile</span>
          </button>
        </div>
      </nav>

      {/* Bottom Padding for Mobile Nav */}
      <div className="md:hidden h-20" />
    </div>
  );
}