"use client";
import React, { ReactNode, useState } from "react";
import { motion } from "framer-motion";
interface MotionProp {
  position?: "right" | "left";
  children: ReactNode;
}

const MotionDiv = ({ position = "right", children }: MotionProp) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <motion.div
      initial={{ x: position === "right" ? 50 : -50, opacity: 0 }}
      animate={{
        x: isVisible ? 0 : position === "right" ? 50 : -50,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onViewportEnter={() => setIsVisible(true)}
      //   onViewportLeave={() => setIsVisible(false)}
      viewport={{ amount: 0.3 }} // 0.3 = 30% of the div must be visible
    >
      {children}
    </motion.div>
  );
};

export const MotionDivVertical = ({ children }: MotionProp) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }} // Start lower
      animate={{
        y: isVisible ? 0 : 50, // Move up when visible
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onViewportEnter={() => setIsVisible(true)}
      viewport={{ amount: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default MotionDiv;
