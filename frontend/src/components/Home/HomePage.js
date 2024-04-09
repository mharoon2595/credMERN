import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ReactTyped } from "react-typed";

const HomePage = () => {
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.2 },
  };

  return (
    <div className="text-center flex flex-col justify-center h-[90%] bgImage">
      {/* <motion.h1
        className="p-2 text-2xl text-white font-bold z-10"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeIn" }}
      >
        All your credit card statements and bill payments,
      </motion.h1>
      <motion.h1
        className="p-2 text-2xl text-white font-bold z-10"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeIn" }}
      >
        all in ONE place!
      </motion.h1> */}
      <ReactTyped
        strings={[
          "Trusted by over 1M customers worldwide.",
          "All major credit cards accepted.",
          "Lightning fast payments!",
        ]}
        typeSpeed={70}
        loop
        backSpeed={20}
        cursorChar="|"
        showCursor={true}
        className="z-50 text-white text-3xl font-semibold"
      />

      <div className="z-10">
        <motion.button
          className="bg-green-400 text-lg w-auto h-10 p-1 rounded-md my-4 "
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
        >
          <Link to="/login">Get started!</Link>
        </motion.button>
      </div>
    </div>
  );
};

export default HomePage;
