import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { appState, cardState, userState } from "state";
import { Controller, useForm } from "react-hook-form";
import { Box, Icon, Input, Sheet } from "zmp-ui";
import { ERROR_MES, ROUTE_PATH } from "utils/constant";
import "./styles.scss";
import { useNavigate } from "react-router-dom";
import { FaFacebook, FaTelegram, FaTiktok } from "react-icons/fa";
import { FaEarthAsia } from "react-icons/fa6";
import * as hooks from "hooks";
import { useModalStore } from "store/modal";
import env from "config/app.config";
import { chooseImage } from "zmp-sdk";
import defaultAvatar from "assets/images/defaultAvatar.png";
import themeDefault from "assets/images/theme_default.png";
import { uploadMultipleOrSingleAction } from "service/upload";
import { TThemeCard } from "types/user";
import request from "utils/request";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const socialDefault = {
  facebook: {
    key: "facebook",
    lable: "Đường dẫn Facebook",
    url: "",
    icon: <FaFacebook size={32} color="#1773ea" />,
  },
  telegram: {
    key: "telegram",
    lable: "Đường dẫn Telegram",
    url: "",
    icon: <FaTelegram size={32} color="#229bd5" />,
  },
  website: {
    key: "website",
    lable: "Đường dẫn Website",
    url: "",
    icon: <FaEarthAsia size={30} color="#61afee" />,
  },
  tiktok: {
    key: "tiktok",
    lable: "Đường dẫn Tiktok",
    url: "",
    icon: <FaTiktok size={30} />,
  },
};

const getBlobFromUrl = async (blobUrl) => {
  const response = await fetch(blobUrl);
  return await response.blob();
};

const CardForm = () => {
  const [card, setCard] = useRecoilState(cardState);
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();
  const [socialFocus, setSocialFocus] = useState(socialDefault.facebook);
  const [socialList, setSocialList] = useState(socialDefault);
  const CardUpdate = hooks.usePOSTAPICardUpdate();
  const [avatar, setAvatar] = useState(card?.avatar?.url || defaultAvatar);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [themeCard, setThemeCard] = useState<TThemeCard>(card?.theme);
  const queryClient = useQueryClient();
  const setGlobal = useSetRecoilState(appState);

  const { data: themesDefault, isLoading } = useQuery({
    queryKey: ["themeDefault"],
    queryFn: async () => {
      const res = await request(
        `${import.meta.env.VITE_WEB_URL_API}/api/app-setting?populate[themes_default][populate]=background`
      );

      return res.data;
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    getValues,
  } = useForm({
    defaultValues: {
      name: card.name || "",
      company: card.company || "",
      position: card.position || "",
      phone: card.phone || "",
      email: card.email || "",
      slogan: card.slogan || "",
    },
    mode: "onBlur",
  });

  const handSetSocialList = () => {
    if (card?.socialMedia?.length > 0) {
      setSocialList((prev) => {
        const updatedSocials = { ...prev };

        card.socialMedia.forEach((item) => {
          if (item.name && updatedSocials[item.name]) {
            updatedSocials[item.name].url = item.url || "";
          }
        });

        return updatedSocials;
      });
    }
  };

  useEffect(() => {
    handSetSocialList();
  }, [card]);

  useEffect(() => {
    if (CardUpdate.isSuccess) {
      setCard((prev) => {
        return { ...prev, ...CardUpdate.data };
      });

      queryClient.invalidateQueries({
        queryKey: ["getCardById", card.documentId],
      });

      useModalStore.setState({
        modal: {
          title: "Cập nhật thành công",
          description: "Thông tin danh thiếp của bạn đã được cập nhật",
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
  }, [CardUpdate.isLoading]);

  const onClickCancel = () => {
    navigate(ROUTE_PATH.PROFILE.path, { replace: ROUTE_PATH.PROFILE.replace });
  };

  const onClickSave = async (data) => {
    setGlobal((prev) => ({ ...prev, isLoading: true }));
    if (avatar !== card?.avatar?.url) {
      const blob = await getBlobFromUrl(avatar); // Lấy Blob từ URL

      const file = new File([blob], "upload.jpg", {
        type: blob.type, // Đảm bảo có type (ví dụ: "image/jpeg")
      });
      const formData = new FormData();
      const refId = card.id?.toString();
      formData.append("files", file); // Đặt tên file tùy ý
      formData.append("ref", "api::card.card"); // The reference type for Food collection
      formData.append("refId", refId || ""); // The ID of the food entry
      formData.append("field", "avatar");

      const res = await uploadMultipleOrSingleAction(formData);
      if (res.uploadSuccess) {
        setAvatar(res?.data[0]?.url);
      } else {
        useModalStore.setState({
          modal: {
            title: "Lỗi tải ảnh",
            description: "Có lỗi trong quá trình tải ảnh, vui lòng thử lại sau",
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
    }

    let socials: { name: string; url: string }[] = [];
    Object.entries(socialList).map(([key, value]) => {
      if (value.url) {
        socials.push({
          name: value.key,
          url: value.url,
        });
      }
    });

    // ctx trong controller
    const params: any = {
      documentId: card.documentId,
      name: data.name,
      company: data?.company || "",
      position: data?.position || "",
      phone: data.phone || "",
      email: data.email || "",
      slogan: data.slogan || "",
      socialMedia: socials,
      id: card.id,
      themeID: themeCard?.documentId || "",
    };
    CardUpdate.post(params);
    setGlobal((prev) => ({ ...prev, isLoading: false }));
  };

  return (
    <div className="editProfileForm pb-24">
      <Box className="editProfile__wrapper relative">
        <div className="chooseTheme fixed right-4 top-32 bg-black bg-opacity-40 p-2 z-10 rounded-full flex items-center gap-2">
          <span className="text-white text-sm">Theme</span>
          <div
            className="w-10 h-10 rounded-full  overflow-hidden border border-slate-300"
            onClick={() => setSheetVisible(true)}
          >
            <img
              src={themeCard ? `${themeCard.background?.url}` : themeDefault}
              alt="ThemeCard"
              className="w-full object-cover h-full"
            />
          </div>
        </div>
        <Box mb={6} className="flex flex-row items-center gap-5">
          <div className="flex flex-row items-center gap-4">
            <div className="zaui-input-label">
              Ảnh đại diện
              <span className="label__required"></span>
            </div>
            <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-300">
              <img
                src={avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="text-center text-sm text-slate-600 font-medium"
              onClick={async () => {
                try {
                  const result = await chooseImage({
                    count: 1,
                    sourceType: ["album"],
                  });
                  if (result.tempFiles.length > 0) {
                    const imageUrl = result.tempFiles[0].path;
                    setAvatar(imageUrl);
                  }
                } catch (error) {
                  useModalStore.setState({
                    modal: {
                      title: "Lỗi chọn ảnh",
                      description:
                        "Có lỗi trong quá trình chọn ảnh, vui lòng thử lại sau",
                      confirmButton: {
                        text: "Xác nhận",
                        onClick: () => {
                          return;
                        },
                      },
                      closeOnConfirm: true,
                      closeOnCancel: true,
                      dismissible: true,
                    },
                  });
                }
              }}
            >
              <Icon icon="zi-gallery" size={28} />
            </div>
          </div>
        </Box>
        <Box mb={6}>
          <div className="zaui-input-label">
            Họ tên (bắt buộc)
            <span className="label__required">*</span>
          </div>
          <Controller
            control={control}
            rules={{
              required: ERROR_MES.MANDATORY_FIELD,
            }}
            render={({ field: { onChange, value }, fieldState }) => (
              <Input
                type="text"
                placeholder="Nhập Họ tên"
                errorText={fieldState.error?.message}
                onChange={(event) => {
                  onChange(event?.target?.value);
                }}
                value={value}
                status={fieldState.invalid ? "error" : ""}
                maxLength={50}
              />
            )}
            name="name"
          />
        </Box>
        <Box mb={6}>
          <div className="zaui-input-label">Công ty</div>
          <Controller
            control={control}
            render={({ field: { onChange, value }, fieldState }) => (
              <Input
                type="text"
                placeholder="Nhập công ty"
                errorText={fieldState.error?.message}
                onChange={(event) => {
                  onChange(event?.target?.value);
                }}
                value={value}
                status={fieldState.invalid ? "error" : ""}
                maxLength={50}
              />
            )}
            name="company"
          />
        </Box>
        <Box mb={6}>
          <div className="zaui-input-label">Chức vụ</div>
          <Controller
            control={control}
            render={({ field: { onChange, value }, fieldState }) => (
              <Input
                type="text"
                placeholder="Nhập chức vụ"
                errorText={fieldState.error?.message}
                onChange={(event) => {
                  onChange(event?.target?.value);
                }}
                value={value}
                status={fieldState.invalid ? "error" : ""}
                maxLength={50}
              />
            )}
            name="position"
          />
        </Box>

        <Box mb={6}>
          <div className="zaui-input-label">Số điện thoại</div>
          <Controller
            control={control}
            render={({ field: { onChange, value }, fieldState }) => (
              <Input
                type="text"
                placeholder="Nhập số điện thoại"
                errorText={fieldState.error?.message}
                onChange={(event) => {
                  setValue("phone", event.target.value); // Không cần re-render toàn form
                }}
                value={value}
                status={fieldState.invalid ? "error" : ""}
                maxLength={50}
              />
            )}
            name="phone"
          />
        </Box>
        <Box mb={6}>
          <div className="zaui-input-label">Email</div>
          <Controller
            control={control}
            render={({ field: { onChange, value }, fieldState }) => (
              <Input
                type="text"
                placeholder="Nhập email"
                errorText={fieldState.error?.message}
                onChange={(event) => {
                  onChange(event?.target?.value);
                }}
                value={value}
                status={fieldState.invalid ? "error" : ""}
                maxLength={50}
              />
            )}
            name="email"
          />
        </Box>
        <Box mb={6}>
          <div className="zaui-input-label">Châm ngôn</div>
          <Controller
            control={control}
            render={({ field: { onChange, value }, fieldState }) => (
              <Input
                type="text"
                placeholder="Nhập châm ngôn"
                errorText={fieldState.error?.message}
                onChange={(event) => {
                  onChange(event?.target?.value);
                }}
                value={value}
                status={fieldState.invalid ? "error" : ""}
                maxLength={50}
              />
            )}
            name="slogan"
          />
        </Box>
        <Box mb={6}>
          <div className="zaui-input-label">Liên kết mạng xã hội</div>
          <div className="flex gap-3 py-1 my-1 flex-1">
            {Object.entries(socialList).map(([key, value]) => (
              <div
                onClick={() => {
                  setSocialFocus(value);
                }}
                key={key}
                className={`${
                  socialFocus.key === key
                    ? "border-b-2 border-[#da291c]"
                    : "border-b-2 border-transparent"
                } pb-1`}
              >
                {value.icon}
              </div>
            ))}
          </div>

          <Input
            label={socialFocus.lable}
            size="small"
            placeholder="Nhập url"
            value={socialFocus.url}
            onChange={(e) => {
              setSocialList((prev) => {
                const updatedSocials = { ...prev };
                updatedSocials[socialFocus.key].url = e.target.value || "";
                return updatedSocials;
              });
            }}
          />
        </Box>
      </Box>
      <Box
        className="editProfile__button--wrapper gap-4 text-base font-medium"
        flex
      >
        <button
          className="editProfile__button--top cancelbtn bg-white border border-blue-500 rounded-full text-blue-500"
          //   variant="secondary"
          //   size="large"
          onClick={onClickCancel}
        >
          Đóng
        </button>
        <button
          className="editProfile__button--bottom submitbtn bg-blue-500 rounded-full py-3"
          //   variant="primary"
          //   size="large"
          onClick={handleSubmit(onClickSave)}
        >
          Hoàn tất
        </button>
      </Box>
      <Sheet
        visible={sheetVisible}
        onClose={() => {
          setSheetVisible(false);
        }}
        autoHeight
        mask
        handler
        swipeToClose
        title="Choose theme"
        height={500}
      >
        <div className="custom-bottom-sheet flex flex-col items-start p-6 gap-4 ">
          {/* <ChooseTheme themeCard={themeCard} /> */}
          <div className="flex flex-col gap-6">
            {themeCard ? (
              <div className="min-h-52">
                <div className="theme_info flex gap-6">
                  <div className={`w-24 h-40 `}>
                    <img
                      src={`${themeCard?.background?.url}`}
                      alt="themeIMG"
                      className="w-full object-cover border-2 border-slate-400"
                    />
                  </div>
                  <div>
                    <div className="">
                      <span className="font-medium text-lg mr-1">Theme: </span>
                      <span className="font-normal text-base capitalize">
                        {themeCard?.name}
                      </span>
                    </div>
                    <div className="">
                      <span className="font-medium text-lg mr-1">
                        Information:{" "}
                      </span>
                      <span className="font-normal text-base capitalize">
                        {themeCard?.description}
                      </span>
                    </div>
                    <div className="">
                      <span className="font-medium text-lg mr-1">Layout: </span>
                      <span className="font-normal text-base capitalize">
                        {themeCard?.layout}
                      </span>
                    </div>
                    <div className="">
                      <span className="font-medium text-lg mr-1">Status: </span>
                      <span className="font-normal text-base capitalize">
                        {themeCard?.statusThemes}
                      </span>
                    </div>
                    <div className="">
                      <span className="font-medium text-lg mr-1">
                        Text color:{" "}
                      </span>
                      <span className="font-normal text-base capitalize">
                        {themeCard?.textColor}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => {}}
                  className="shadow-md float-right mt-3 bg-blue-600 text-white py-2 px-4 rounded-full text-base font-medium inline-block "
                >
                  Preview
                </div>
              </div>
            ) : (
              <div></div>
            )}
            <div>
              <div className="flex flex-col gap-2 mb-2">
                <h3 className="text-lg font-semibold">Theme Default</h3>
                <div className="flex gap-4">
                  {themesDefault?.themes_default?.length > 0 ? (
                    themesDefault?.themes_default?.map((item, i) => {
                      return (
                        <div
                          className={`w-12 h-12 rounded-full  overflow-hidden ${themeCard?.documentId === item?.documentId ? `border-[3px] border-blue-600 ` : `border border-slate-300`}`}
                          onClick={() => {
                            setThemeCard(item);
                          }}
                          key={i}
                        >
                          <img
                            src={`${item?.background?.url}`}
                            alt="themeIMG"
                            className="w-full object-cover"
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div>Don't have theme default</div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold">Theme List</h3>
                <div className="flex gap-4">
                  {user?.themesCard?.length > 0 ? (
                    user?.themesCard.map((item, i) => {
                      return (
                        <div
                          className={`w-12 h-12 rounded-full  overflow-hidden ${themeCard?.documentId === item?.documentId ? `border-[3px] border-blue-600 ` : `border border-slate-300`}`}
                          onClick={() => {
                            setThemeCard(item);
                          }}
                          key={i}
                        >
                          <img
                            src={`${item?.background?.url}`}
                            alt="themeIMG"
                            className="w-full object-cover"
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div>You don't have theme</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Sheet>
    </div>
  );
};

export default CardForm;
