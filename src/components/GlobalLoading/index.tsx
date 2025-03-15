import React from "react";
import { Spinner } from "zmp-ui";

const GlobalLoading = () => {
  return (
    <div
      className="fixed w-full h-full grid place-items-center"
      style={{ backdropFilter: "invert(20%)", zIndex: 999 }}
    >
      <Spinner visible />
    </div>
  );
};

export default GlobalLoading;
