import React, { FC } from "react";
import { Route, Routes } from "react-router";
import { Box } from "zmp-ui";
import { Navigation } from "./navigation";
import { getSystemInfo } from "zmp-sdk";
import { ScrollRestoration } from "./scroll-restoration";
import Profile from "pages/Profile";
import EditProfile from "pages/EditProfile";
import CardInformation from "pages/CardInformation";
import { ROUTE_PATH } from "utils/constant";
import QRCodePage from "pages/QRCodePage";
import AddContact from "pages/AddContact";
import HomeApp from "pages/HomeApp";

if (import.meta.env.DEV) {
  document.body.style.setProperty("--zaui-safe-area-inset-top", "24px");
} else if (getSystemInfo().platform === "android") {
  const statusBarHeight =
    window.ZaloJavaScriptInterface?.getStatusBarHeight() ?? 0;
  const androidSafeTop = Math.round(statusBarHeight / window.devicePixelRatio);
  document.body.style.setProperty(
    "--zaui-safe-area-inset-top",
    `${androidSafeTop}px`
  );
}

export const Layout: FC = () => {
  return (
    <Box flex flexDirection="column" className="h-screen">
      <ScrollRestoration />
      <Box className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          <Route path={ROUTE_PATH.HOME.path} element={<HomeApp />}></Route>
          <Route
            path={ROUTE_PATH.ADD_CONTACT.path}
            element={<AddContact />}
          ></Route>
          <Route
            path={ROUTE_PATH.EDIT_PROFILE.path}
            element={<EditProfile />}
          ></Route>
          <Route
            path={ROUTE_PATH.CARD_INFO.path}
            element={<CardInformation />}
          ></Route>
          <Route path={ROUTE_PATH.PROFILE.path} element={<Profile />}></Route>
          <Route
            path={ROUTE_PATH.QR_CODE.path}
            element={<QRCodePage />}
          ></Route>
        </Routes>
      </Box>
      <Navigation />
    </Box>
  );
};
