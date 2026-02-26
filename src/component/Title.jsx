import React from "react";

const Title = ({title, sub_title}) => {
  return (
    <div>
      {" "}
      <div className="flex flex-col ">
        <p className="text-sm text-header_icons-light dark:text-header_icons-dark font-layout-font">
          {title} / {sub_title}
        </p>
        <p className="text-2xl text-header_icons-light dark:text-header_icons-dark font-layout-font font-semibold">
          {sub_title}
        </p>
      </div>
    </div>
  );
};

export default Title;