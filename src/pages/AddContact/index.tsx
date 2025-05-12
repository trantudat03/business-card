import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { Welcome } from "pages/index/welcome";
import QrScanner from "qr-scanner";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModalStore } from "store/modal";
import { ROUTE_PATH } from "utils/constant";
import { handExtractPath } from "utils/link";
import { chooseImage } from "zmp-sdk";
import { Header, Icon, Page } from "zmp-ui";

const AddContact = () => {
  const navigate = useNavigate();
  return (
    <Page className="flex flex-col flex-1 bg-white">
      <Welcome />
      <div className="content flex flex-col gap-5 flex-1 relative bg-white z-10">
        <Scanner
          onScan={(result) => {
            if (result?.length > 0) {
              navigate(handExtractPath(result[0].rawValue) || "/app-home", {
                replace: ROUTE_PATH.CARD_INFO.replace,
                state: { from: "addContact" },
              });
            }
          }}
          onError={(err) => console.error("Lỗi:", err)}
          styles={{
            container: {
              position: "absolute", // Để Scanner nổi lên trên
              top: 0,
              left: 0,
              //   width: "400px",
              height: "auto",
              zIndex: 20, // Cao hơn bg đen
            },
            video: { height: "100%", width: "100%" },
            finderBorder: 30,
          }}
        />

        <div className="flex justify-between px-10 absolute bottom-10 left-0 w-full z-20 ">
          <div
            className="text-center text-lg text-black font-medium"
            onClick={async () => {
              try {
                const result = await chooseImage({
                  count: 1,
                  sourceType: ["album"],
                });
                if (result.tempFiles.length > 0) {
                  const imageUrl = result.tempFiles[0].path;
                  QrScanner.scanImage(imageUrl)
                    .then((result) => {
                      navigate(handExtractPath(result) || "/app-home", {
                        replace: ROUTE_PATH.CARD_INFO.replace,
                        state: { from: "addContact" },
                      });
                    })
                    .catch(() => {
                      useModalStore.setState({
                        modal: {
                          title: "Lỗi Scan ảnh",
                          description: "Vui lòng chọn ảnh có QR Code",
                          confirmButton: {
                            text: "Xác nhận",
                            onClick: () => {},
                          },
                          closeOnConfirm: true,
                          closeOnCancel: true,
                          dismissible: true,
                        },
                      });
                    });
                }
              } catch (error) {
                useModalStore.setState({
                  modal: {
                    title: "Lỗi chọn ảnh",
                    description:
                      "Có lỗi trong quá trình chọn ảnh, vui lòng thử lại sau",
                    confirmButton: { text: "Xác nhận", onClick: () => {} },
                    closeOnConfirm: true,
                    closeOnCancel: true,
                    dismissible: true,
                  },
                });
              }
            }}
          >
            <Icon icon="zi-gallery" size={32} />
            <p>Thư viện</p>
          </div>

          <div className="text-center text-lg text-black font-medium">
            <Icon icon="zi-retry" size={32} />
            <p>Gần đây</p>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default AddContact;
