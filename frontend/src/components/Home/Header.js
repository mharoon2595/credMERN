import React, { useContext, useEffect } from "react";
import CardContext from "../../context/context";
import logo from "../../assets/logo.png";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Backdrop from "../../utils/Backdrop";
import { motion, AnimatePresence } from "framer-motion";
import down from "../../assets/downArrow.png";

const Header = () => {
  const auth = useContext(CardContext);
  const [dropdown, setDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    showSidebar
      ? (document.body.style.overflowY = "hidden")
      : (document.body.style.overflowY = "auto");
  }, [showSidebar]);

  const clickHandler = () => {
    setDropdown(true);
  };

  const logoutHandler = () => {
    auth.logout();
    setDropdown(false);
    navigate("/");
  };

  const openSidebar = () => {
    setShowSidebar(true);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  return (
    <>
      <AnimatePresence>
        <div className="flex flex-row-reverse sm:flex-row w-full justify-between bg-yellow-400 px-3 py-1 h-[10%] ">
          {auth.token ? (
            <>
              <img
                src={logo}
                alt="companyLogo"
                className="w-32 md:w-40 h-[90%] sm:h-full my-auto cursor-pointer"
                onClick={() => navigate(`${auth.userId}/cards`)}
              />
              <div className="hidden sm:flex gap-2 my-auto">
                <NavLink
                  to="/add"
                  className={({ isActive }) =>
                    isActive
                      ? "p-2 bg-lime-500 border  border-black rounded-lg my-auto"
                      : " p-2 border border-black rounded-lg my-auto"
                  }
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  Add card
                </NavLink>
                <NavLink
                  to={`${auth.userId}/cards`}
                  className={({ isActive }) =>
                    isActive
                      ? "p-2 bg-lime-500 border  border-black rounded-lg my-auto"
                      : " p-2 border border-black rounded-lg my-auto"
                  }
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  View cards
                </NavLink>
                <div>
                  <div className="relative">
                    <button
                      className=" flex p-2 border-2 border-black  rounded-lg cursor-pointer"
                      onClick={clickHandler}
                      onTouchStart={clickHandler}
                      onBlur={() => setDropdown(false)}
                    >
                      <span>
                        {" "}
                        Hi{" "}
                        {auth.name.includes(" ")
                          ? auth.name.split(" ")[0]
                          : auth.name}
                        !
                      </span>

                      <motion.img
                        animate={{ rotate: dropdown ? -180 : 0 }}
                        transition={{ duration: 0.5 }}
                        src={down}
                        className="w-5 h-5 my-auto"
                      />
                    </button>
                    {dropdown && (
                      <div
                        className="absolute bg-slate-200 p-2 rounded-md w-full z-[100] shadow-lg cursor-pointer"
                        onMouseDown={logoutHandler}
                      >
                        Logout
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 sm:hidden">
                <div className="my-auto sm:hidden" onClick={openSidebar}>
                  <div className="w-10 h-1 bg-black my-2"></div>
                  <div className="w-10 h-1 bg-black my-2"></div>
                  <div className="w-10 h-1 bg-black my-2"></div>
                </div>

                <div className="relative sm:hidden my-auto sm:m-0">
                  <button
                    className=" flex p-2 border-2 border-black  rounded-lg cursor-pointer"
                    onClick={clickHandler}
                    onTouchStart={clickHandler}
                    onBlur={() => setDropdown(false)}
                  >
                    <span>
                      {" "}
                      Hi{" "}
                      {auth.name.includes(" ")
                        ? auth.name.split(" ")[0]
                        : auth.name}
                      !
                    </span>

                    <motion.img
                      animate={{ rotate: dropdown ? -180 : 0 }}
                      transition={{ duration: 0.5 }}
                      src={down}
                      className="w-5 h-5 my-auto"
                    />
                  </button>
                  {dropdown && (
                    <div
                      className="absolute bg-slate-200 p-2 rounded-md w-full z-[100] shadow-lg cursor-pointer"
                      onMouseDown={logoutHandler}
                    >
                      Logout
                    </div>
                  )}
                </div>
              </div>

              {showSidebar && <Backdrop onClick={closeSidebar} />}
              {showSidebar && (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute z-[1000] left-0 top-0 min-h-screen sm:hidden bg-slate-500 w-[50%]"
                >
                  <div
                    className="flex flex-col gap-2 p-4"
                    onClick={closeSidebar}
                  >
                    <NavLink
                      to="/add"
                      className={({ isActive }) =>
                        isActive
                          ? "p-2 bg-lime-500 border  border-black rounded-lg my-auto"
                          : " p-2 border border-black rounded-lg my-auto"
                      }
                      style={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      Add card
                    </NavLink>
                    <NavLink
                      to={`${auth.userId}/cards`}
                      className={({ isActive }) =>
                        isActive
                          ? "p-2 bg-lime-500 border  border-black rounded-lg my-auto"
                          : " p-2 border border-black rounded-lg my-auto"
                      }
                      style={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      View cards
                    </NavLink>
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            <>
              <img src={logo} alt="companyLogo" className="w-15 h-10 my-auto" />
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "p-2 bg-lime-500 border  border-black rounded-lg my-auto"
                    : " p-2 border-2 border-black rounded-lg my-auto"
                }
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                Login
              </NavLink>
            </>
          )}
        </div>
      </AnimatePresence>
    </>
  );
};

export default Header;
