import React, { useEffect, useState } from "react";
import { Header, Icon, Page } from "zmp-ui";
import { QRCodeSVG } from "qrcode.react";
import { useRecoilValue } from "recoil";
import { cardState, userState } from "state";
import env from "config/app.config";
import { generatePath, useLocation } from "react-router-dom";
import { ROUTE_PATH } from "utils/constant";
import QRCodeItem from "components/QRCodeItem";
const QRCodePage = () => {
  const card = useRecoilValue(cardState);
  const user = useRecoilValue(userState);
  const location = useLocation();
  const [link, setLink] = useState("");
  const handCreateLink = (cardId) => {
    // Bước 1: Tạo đường dẫn cơ sở với /card-info:cardId
    let baseUrl = `${env.VITE_ZALO_APP_URL}/card-info/${cardId}`;
    if (location.search) {
      const extraParams = location.search;
      baseUrl += extraParams;
    }
    return baseUrl;
  };

  useEffect(() => {
    setLink(handCreateLink(card.documentId));
  }, []);

  return (
    <Page className="flex flex-col flex-1 bg-white">
      <Header showBackIcon title="Mã của tôi" />
      <div className="content flex flex-col items-center p-6 overflow-y-scroll">
        {card && (
          <img
            src={
              card?.avatar?.url ? `${card?.avatar?.url}` : user?.avatar || ""
            }
            alt="Avatar"
            className="w-20 h-20 rounded-full border"
          />
        )}
        <h2 className="mt-2 text-lg font-semibold">{card?.name}</h2>
        {/* <p className="text-gray-500">@dat.trantu</p> */}

        <QRCodeItem cardId={card.documentId} />

        {/* Nút Reset QR */}
        <div className="w-full items-center flex flex-col mt-4 gap-6">
          <button className="mt-3 px-4 py-2 text-sm font-semibold rounded-full bg-slate-100">
            Làm mới QR code
          </button>

          {/* Nút Share */}
          <button className=" w-full bg-blue-500 text-white py-2 rounded-3xl text-lg font-semibold flex items-center justify-center gap-2">
            <Icon icon="zi-share" size={28} />
            <span>Chia sẻ</span>
          </button>
        </div>
      </div>
    </Page>
  );
};

export default QRCodePage;
