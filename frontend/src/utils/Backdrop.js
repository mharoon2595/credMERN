import React from "react";
import ReactDOM from "react-dom";

const Backdrop = ({ onClick }) => {
  const backdrop = (
    <div
      className="fixed z-50 bg-slate-600 opacity-80 w-full h-full sm:hidden"
      onClick={onClick}
    ></div>
  );

  return ReactDOM.createPortal(
    backdrop,
    document.getElementById("backdrop-hook")
  );
};

export default Backdrop;
