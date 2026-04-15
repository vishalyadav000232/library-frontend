import React from "react"
import { motion } from "framer-motion"
import TopNavBar from "../components/TopNavBar"
import BottomNavBar from "../components/BotttomNavBar"
import { Outlet, useNavigation } from "react-router-dom"
import Loader from "../components/Loader"

const LayoutPage = () => {
  const navigation = useNavigation()

  const isLoading = navigation.state === "loading"

  return (
    <motion.div
      className="min-h-screen bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <TopNavBar />

      {/* Pending UI */}
      {isLoading && <Loader />}

      <Outlet />

      <BottomNavBar />
    </motion.div>
  )
}

export default LayoutPage
