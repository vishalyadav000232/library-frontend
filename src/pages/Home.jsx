
import { BookOpen, User, ChevronRight  ,Armchair , Calendar ,Clock, Phone, MapPin} from "lucide-react";
import React from 'react'
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";


const Home = () => {
const navigate = useNavigate()
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

const handleNavigation = ()=>{
navigate("/dashboard/seats")
}

const handleExplore = ()=>{

}
  return (
    <div>
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
                onClick={() => handleNavigation()}
                className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition flex items-center gap-2"
              >
                Book a Seat
                <ChevronRight  className="w-5 h-5" />
              </button>
              <button
                onClick={()=> handleExplore()}
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
                      opacity: `${Math.random() *1}`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
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
      <Footer/>
    </div>
  )
}

export default Home


