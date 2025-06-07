import React, { useRef, useEffect, useState } from "react";
import QrScanner from "qr-scanner";
import { Welcome } from "pages/index/welcome";
import { useNavigate } from "react-router-dom";
import { useModalStore } from "store/modal";
import { ROUTE_PATH } from "utils/constant";
import { handExtractPath } from "utils/link";
import { chooseImage } from "zmp-sdk";
import { Header, Icon, Page } from "zmp-ui";
import CustomScanner from "components/CustomScanner";



const AddContact = () => {
  const navigate = useNavigate();

  const handleDetected = (data) => {
    console.log("Navigating with QR data:", data);
    navigate(handExtractPath(data) || "/app-home", {
      replace: ROUTE_PATH.CARD_INFO.replace,
      state: { from: "addContact" },
    });
  };

  const handleChooseImage= async () => {
    try {
      const result = await chooseImage({ count: 1, sourceType: ["album"] });
      if (result.tempFiles.length > 0) {
        const imageUrl = result.tempFiles[0].path;
        QrScanner.scanImage(imageUrl)
          .then((result) => {
            console.log("Image scan result:", result);
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
                confirmButton: { text: "Xác nhận", onClick: () => {} },
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
          description: "Có lỗi trong quá trình chọn ảnh, vui lòng thử lại sau",
          confirmButton: { text: "Xác nhận", onClick: () => {} },
          closeOnConfirm: true,
          closeOnCancel: true,
          dismissible: true,
        },
      });
    }
  }

  return (
    <Page className="flex flex-col flex-1 bg-white">
      <Welcome />
      <div className="content flex flex-col gap-5 flex-1 relative bg-white z-10">
        <CustomScanner onDetected={handleDetected} />
        <div className="flex gap-8 justify-center items-center px-10 absolute bottom-0 left-0 w-full z-20 bg-white/30 py-4">
          <div
            className="text-center text-base text-white font-medium"
            onClick={handleChooseImage}
          >
            <Icon icon="zi-gallery" size={30} style={{fontWeight: "bold"}}/>
            <p>Thư viện</p>
          </div>

          <div className="text-center text-base text-white font-medium">
            <Icon icon="zi-retry" size={30} style={{fontWeight: "bold"}}/>
            <p>Lịch sử</p>
          </div>

          <div 
            className="text-center text-base text-white font-medium" 
            onClick={() => {
              navigate(ROUTE_PATH.QR_CODE.path, {
              replace: ROUTE_PATH.QR_CODE.replace,
              });
            }}>
            <Icon icon="zi-qrline" size={30} style={{fontWeight: "bold"}}/>
            <p>QR của tôi</p>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default AddContact;
