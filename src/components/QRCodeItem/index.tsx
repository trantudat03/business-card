import env from "config/app.config";
import { QRCodeSVG } from "qrcode.react";
import React, { useEffect, useState } from "react";

const QRCodeItem = ({ cardId }) => {
  const [link, setLink] = useState("");

  const handCreateLink = (cardId) => {
    // Bước 1: Tạo đường dẫn cơ sở với /card-info:cardId
    let baseUrl = `${env.VITE_ZALO_APP_URL}/card-info/${cardId}`;
    if (location.search) {
      const extraParams = location.search;
      // Thêm phần tham số vào sau baseUrl
      baseUrl += extraParams;
    }
    return baseUrl;
  };

  useEffect(() => {
    setLink(handCreateLink(cardId));
  }, [cardId]);
  return (
    <>
      {link && (
        <div className="w-60 mt-6">
          {<QRCodeSVG height={"auto"} width={"100%"} value={link} />}
        </div>
      )}
    </>
  );
};

export default QRCodeItem;
