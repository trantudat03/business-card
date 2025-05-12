import CMSImage from "components/cmsImage";
import env from "config/app.config";
import React from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { useModalStore } from "store/modal";
import { ROUTE_PATH } from "utils/constant";
import { openChat } from "zmp-sdk";
import { Icon } from "zmp-ui";

const CardItem = ({
  cardInfo,
  isMyCard = false,
}: {
  cardInfo: any;
  isMyCard?: boolean;
}) => {
  const navigate = useNavigate();
  return (
    <div
      key={cardInfo?.documentId}
      className="w-full bg-white flex gap-2 cardInfos-center my-4"
      onClick={() => {
        navigate(
          generatePath(ROUTE_PATH.CARD_INFO.path, {
            id: cardInfo?.documentId,
          }),
          {
            replace: ROUTE_PATH.CARD_INFO.replace,
            state: { from: "appHome" },
          }
        );
      }}
    >
      <div>
        <div className="w-14 h-14 rounded-full overflow-hidden">
          {cardInfo?.avatar ? (
            <img
              src={cardInfo?.avatar ? `${cardInfo?.avatar?.url}` : ""}
              className="w-full h-full object-cover"
            />
          ) : (
            <CMSImage
              fieldName="defaultAvatar"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
      <div>
        <div className="text-lg font-medium">{cardInfo?.name}</div>
        <div className="text-sm ">
          <p>{cardInfo?.position}</p>
          <p>{cardInfo?.company}</p>
        </div>
      </div>
      {!isMyCard ? (
        <div className="flex flex-1 justify-end pr-4 items-center">
          <div
            onClick={async (e) => {
              e.stopPropagation();
              try {
                await openChat({
                  type: "user",
                  id: cardInfo?.user?.ZaloIdByApp || "khkf2384kjfshk89347",
                  message: "",
                });
              } catch (error) {
                useModalStore.setState({
                  modal: {
                    title: "Lỗi hệ thống",
                    description: "Xảy ra lỗi vui lòng thử lại sau",
                    confirmButton: {
                      text: "Xác nhận",
                      onClick: () => {},
                    },
                    closeOnConfirm: true,

                    closeOnCancel: true,
                    dismissible: true,
                  },
                });
              }
            }}
          >
            <Icon
              icon="zi-chat"
              size={30}
              className="font-medium text-blue-500"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 justify-end pr-4 items-center">
          <Icon
            icon="zi-info-circle"
            size={30}
            className="font-medium text-slate-600"
          />
        </div>
      )}
    </div>
  );
};

export default CardItem;
