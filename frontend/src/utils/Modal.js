import React from "react";
import ReactDOM from "react-dom";

const Modal = (props) => {
  const { onClick } = props;
  const modal = (
    <div className="bg-white rounded-md fixed z-[100] top-[22vh] left-[50%] transform -translate-x-1/2 w-[40%]">
      {props.children}
    </div>
  );

  return ReactDOM.createPortal(modal, document.getElementById("modal-hook"));
};

export default Modal;
