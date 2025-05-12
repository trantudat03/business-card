import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { appState } from "state";
import { sleep } from "utils/utils";
import { Spinner } from "zmp-ui";

const GlobalLoading = () => {
  const global = useRecoilValue(appState);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("sjkdhfksd", global?.isLoading);
    if (global?.isLoading) {
      setIsLoading(true);
    } else {
      sleep(500).then(() => {
        setIsLoading(global?.isLoading);
      });
    }
  }, [global?.isLoading]);
  return (
    <div
      className={`fixed inset-0 flex justify-center items-center transition-all duration-500 ${
        isLoading
          ? "pointer-events-auto bg-black/70"
          : "pointer-events-none bg-transparent"
      }`}
      style={{
        zIndex: 99999,
      }}
    >
      <Spinner visible={isLoading} />
    </div>
  );
};

export default GlobalLoading;
