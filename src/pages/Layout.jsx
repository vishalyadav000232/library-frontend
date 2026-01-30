import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Home, User, Search  ,Armchair , Calendar ,Clock} from "lucide-react";
import TopNavBar from "../components/TopNavBar";
import BottomNavBar from "../components/BotttomNavBar";
import { Outlet } from "react-router-dom";

const LayoutPage = () => {
  
  return (
    <motion.div
      className="min-h-screen bg-gray-100 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
    <TopNavBar/>
    <Outlet/>
    <BottomNavBar/>
    </motion.div>
  );
};

export default LayoutPage;