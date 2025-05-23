import env from "config/app.config";
import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { appState, cardState, userState } from "state";
import { Box, Button, Header, Icon, Page, Select, Sheet, Text } from "zmp-ui";
import { GoMail } from "react-icons/go";
import { FaFacebook, FaTelegram, FaTiktok } from "react-icons/fa";
import { FaEarthAsia } from "react-icons/fa6";
import { BsBuildings } from "react-icons/bs";
import { useLocation, useParams } from "react-router-dom";
import { TCard } from "types/user";
import { useQuery } from "@tanstack/react-query";
import { cmsAxios } from "utils/axios";
import { CheckAction } from "service/card";
import request from "utils/request";
import QRCodeItem from "components/QRCodeItem";
import { openShareSheet } from "zmp-sdk";
import { handCreateLinkCardInfo } from "utils/link";
import * as hooks from "hooks";
import CMSImage from "components/cmsImage";
import { useModalStore } from "store/modal";

const CardInformation = () => {
  const card = useRecoilValue(cardState);
  const user = useRecoilValue(userState);
  const [cardInfo, setCardInfo] = useState<TCard>({} as TCard);
  const { id } = useParams();
  const location = useLocation();
  const [showAction, setShowAction] = useState(true);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const useDeleteContact = hooks.useDeleteContact();
  const useCreateContact = hooks.useCreateContact();
  const setGlobal = useSetRecoilState(appState);

  const { data, isPending, refetch } = useQuery({
    queryKey: ["getCardById", id],
    queryFn: async () => {
      try {
        setGlobal((prev) => ({ ...prev, isLoading: true }));
        const res = await request.post(
          `${
            import.meta.env.VITE_WEB_URL_API
          }/api/func-customer/get-action-card`,
          {
            // method: "POST",
            data: id,
          }
        );
        setGlobal((prev) => ({ ...prev, isLoading: false }));
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    // enabled: !!id, //&& !isMyCard && !!user?.userTokens?.cmsAccessToken,
  });

  useEffect(() => {
    if (data) {
      setCardInfo(data);
    }
  }, [data]);

  const handReturnValue = (text: string) => {
    if (text) {
      text.charAt(0).toUpperCase();
      return text;
    }
    return "Chưa cập nhật!";
  };

  const getSocialIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "facebook":
        return <FaFacebook color="#1773ea" size={32} />;
      case "telegram":
        return <FaTelegram color="#229bd5" size={32} />;
      case "website":
        return <FaEarthAsia color="#61afee" size={30} />;
      case "tiktok":
        return <FaTiktok size={30} />;
      default:
        return null;
    }
  };

  return (
    <Page className="flex flex-col flex-1 ">
      <Header showBackIcon title="Danh thiếp" />
      <div
        className={`content relative w-full h-full overflow-y-scroll`}
        onClick={() => {
          if (showMenu) {
            setShowMenu((prev) => !prev);
          }
          setShowAction((prev) => !prev);
        }}
        style={{
          backgroundImage: cardInfo?.theme?.background?.url
            ? `url('${cardInfo.theme.background.url}')`
            : "none",
          backgroundColor: cardInfo?.theme?.background?.url
            ? "transparent"
            : "white",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          width: "100%",
          height: "100%",
        }}
      >
        {cardInfo?.documentId && (
          <div className="w-full h-full max-h-[700px] p-8 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-500 mb-4">
              {cardInfo?.avatar ? (
                <img
                  className="w-full object-cover h-full"
                  src={cardInfo?.avatar ? `${cardInfo?.avatar?.url}` : ""}
                />
              ) : (
                <CMSImage
                  fieldName="defaultAvatar"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="text-center mb-6">
              <h2
                className="text-2xl font-bold text-center"
                style={{
                  color: `${cardInfo?.theme ? `${cardInfo?.theme?.textColor}` : `black`}`,
                }}
              >
                {cardInfo?.name}
              </h2>
              <p className="text-lg text-blue-600 dark:text-blue-400">
                {handReturnValue(cardInfo?.position)}
              </p>
              <div
                className="infoCardWrap  items-center justify-center text-gray-600 dark:text-gray-300"
                style={{
                  color: `${cardInfo?.theme ? `${cardInfo?.theme?.textColor}` : `black`}`,
                }}
              >
                <BsBuildings size={22} />
                <span>{handReturnValue(cardInfo?.company)}</span>
              </div>
            </div>
            {/* Slogan */}
            {cardInfo?.slogan && (
              <div className="text-center mb-6">
                <p
                  className=" italic text-base"
                  style={{
                    color: `${cardInfo?.theme ? `${cardInfo?.theme?.textColor}` : `#4B5563`}`,
                  }}
                >
                  "{cardInfo?.slogan}"
                </p>
              </div>
            )}
            {/* Contact Information */}
            <div className="w-full space-y-3 mb-6 flex flex-col">
              <button
                onClick={() => {
                  if (cardInfo?.phone) {
                    window.location.href = `tel:+${cardInfo?.phone}`;
                  } else {
                    useModalStore.setState({
                      modal: {
                        title: "Thông báo",
                        content: "Người dùng chưa cập nhật số điện thoại",
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
                className="w-full flex items-center justify-center space-x-2 p-3 rounded-full bg-gradient-to-r from-[#4ade80] to-[#22c55e] text-white transition-all duration-300 transform active:scale-95"
              >
                <Icon icon="zi-call" size={28} className="animate-pulse" />
                <span>{handReturnValue(cardInfo?.phone)}</span>
              </button>

              <div
                onClick={() => {
                  if (cardInfo?.email)
                    window.location.href = `mailto:${cardInfo?.email}`;
                  else {
                    useModalStore.setState({
                      modal: {
                        title: "Thông báo",
                        content: "Người dùng chưa cập nhật thông tin Email",
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
                className=" flex items-center justify-center space-x-2 p-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg active:scale-95"
              >
                <GoMail className="animate-pulse " size={24} />
                <span className="break-all">
                  {handReturnValue(cardInfo?.email)}
                </span>
              </div>
            </div>
            {/* Social Media */}
            <div className="flex space-x-4 mt-auto">
              {cardInfo?.socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {getSocialIcon(social.name)}
                </a>
              ))}
            </div>
          </div>
        )}
        {showAction && (
          <div className="action absolute top-4 right-2">
            <div className=" flex flex-col gap-2">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  const link = handCreateLinkCardInfo(cardInfo?.documentId);
                  try {
                    openShareSheet({
                      type: "link",
                      data: {
                        link: link,
                        chatOnly: false,
                      },
                      success: (data) => {},
                      fail: (err) => {},
                    });
                  } catch (error) {}
                }}
              >
                <Icon icon="zi-share" size={30} className="text-blue-500" />
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setSheetVisible(true);
                }}
              >
                <Icon icon="zi-qrline" size={30} className="text-blue-500" />
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu((prev) => !prev);
                }}
                className="relative"
              >
                {showMenu && (
                  <Box className="absolute right-full z-50 bg-white shadow-md p-2 flex flex-col rounded-sm min-w-40">
                    <div className="text-sm font-semibold flex flex-col gap-1 px-2 ">
                      <div className="border-b border-slate-200 py-1 flex items-end gap-2">
                        <span> Yêu thích</span>
                        <span>
                          <Icon icon="zi-heart" size={20} />
                        </span>
                      </div>
                      <div className="border-b border-slate-200 py-1">
                        Sửa biệt danh
                      </div>
                      {cardInfo?.action === "none" ? (
                        <div
                          className="py-1"
                          onClick={async () => {
                            try {
                              useCreateContact.post({
                                card: cardInfo,
                                userDocumentId: user.id,
                              });
                              refetch();
                            } catch {}
                          }}
                        >
                          Thêm danh thiếp
                        </div>
                      ) : cardInfo?.action === "own" ? (
                        <div>Chỉnh sửa</div>
                      ) : (
                        <div
                          className="py-1"
                          onClick={async () => {
                            await useDeleteContact.delete({
                              documentId: cardInfo.contactId,
                            });

                            refetch();
                          }}
                        >
                          Quên danh thiếp
                        </div>
                      )}
                    </div>
                  </Box>
                )}

                <Icon icon="zi-list-2" size={32} className="text-blue-500" />
              </div>
            </div>
          </div>
        )}
      </div>
      <Sheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        autoHeight
        mask
        handler
        swipeToClose
        title="Qr Code"
      >
        <Box
          p={4}
          className="custom-bottom-sheet flex flex-col items-center p-6"
          flex
          flexDirection="column"
        >
          <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-400">
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
          <h2 className=" text-lg font-semibold">{cardInfo?.name}</h2>
          {/* <p className="text-gray-500">@dat.trantu</p> */}

          <QRCodeItem cardId={cardInfo.documentId} />
        </Box>
      </Sheet>
    </Page>
  );
};

export default CardInformation;
