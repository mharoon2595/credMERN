import React, { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ReactTyped } from "react-typed";
import CardContext from "../../context/context";

const HomePage = () => {
  const auth = useContext(CardContext);
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.2 },
  };

  useEffect(() => {
    console.log("yooooo");
    if (!!auth.token) {
      console.log("executed budd");
      auth.logout();
    }
  }, [auth.token]);

  return (
    <div className="text-center flex flex-col justify-center h-[90%] bgImage">
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
