import React from "react";

const Modal = ({ children }) => {
  return (
    <div className="fixed inset-0 z-30  backdrop-blur-sm flex justify-center items-center ">
      <div className="overflow-hidden bg-layout-light dark:bg-layout-dark  flex items-end  justify-between relative font-poppins mx-1">
        {children}
      </div>
    </div>
  );
};

export default Modal;