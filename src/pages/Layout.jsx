import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import TopNavBar from "../components/TopNavBar"
import BottomNavBar from "../components/BotttomNavBar"
import { Outlet, useNavigation, useLocation } from "react-router-dom"
import Loader from "../components/Loader"

const LayoutPage = () => {
  const navigation = useNavigation()
  const location = useLocation()
  

  const isLoading = navigation.state === "loading"

  return (
    <motion.div
      className="min-h-screen bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <TopNavBar />

      
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader />
        </div>
      )}

     
      <div className="min-h-[80vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNavBar />
    </motion.div>
  )
}

export default LayoutPage