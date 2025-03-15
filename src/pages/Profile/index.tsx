import { Welcome } from "pages/index/welcome";
import React from "react";
import { useRecoilValue } from "recoil";
import { cardState, userState } from "state";
import { Box, Button, Header, Icon, Page } from "zmp-ui";
import "./styles.scss";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "utils/constant";
const Profile = () => {
  const user = useRecoilValue(userState);
  const card = useRecoilValue(cardState);
  const avatar = user?.avatar;
  const name = user.name;
  const navigate = useNavigate();
  return (
    <Page className="bg-white">
      {/* <Header title="Thông báo"  showBackIcon={false} /> */}
      <Welcome />
      <div className="profile">
        <Box className="profile__profile--wrapper">
          <div className="profile__profile--avatarImg">
            <img
              src={avatar}
              alt="profile-avatar"
              className="profile__content--logo"
            />
          </div>
          <Box flex flexDirection="column" justifyContent="space-around" px={1}>
            <div className="profile__profile--name">{name}</div>
            <div className="profile__profile--welcome">
              Thành viên e-business
            </div>
          </Box>
          <Box
            ml={4}
            onClick={() => {
              navigate(ROUTE_PATH.QR_CODE.path, {
                replace: ROUTE_PATH.QR_CODE.replace,
              });
            }}
          >
            <div>Mã của tôi</div>
            <Icon icon="zi-qrline" size={33} className="text-blue-500" />
          </Box>
        </Box>
        <div className="flex flex-col gap-8 mt-10">
          <div
            className={`profile__profile--category`}
            onClick={() => {
              navigate(
                generatePath(ROUTE_PATH.CARD_INFO.path, {
                  id: card?.documentId,
                }),
                {
                  replace: ROUTE_PATH.CARD_INFO.replace,
                  state: { from: "profile" },
                }
              );
            }}
          >
            Danh thiếp của tôi
          </div>
          <div
            className={`profile__profile--category`}
            onClick={() => {
              navigate(ROUTE_PATH.EDIT_PROFILE.path, {
                replace: ROUTE_PATH.EDIT_PROFILE.replace,
              });
            }}
          >
            Chỉnh sửa danh thiếp
          </div>
          <div className={`profile__profile--category`} onClick={() => {}}>
            Lịch sử quét mã
          </div>
          <div className={`profile__profile--category`} onClick={() => {}}>
            Giới thiệu bạn bè
          </div>
        </div>
        <Button
          //   variant="tertiary"
          size="large"
          // onClick={onClickShare}
          // prefixIcon={<img src={shareIcon} alt="share zalo mini app" />}
          className="button-share-zalo bg-white border border-blue-500"
        >
          Chia sẻ ứng dụng
        </Button>
      </div>
    </Page>
  );
};

export default Profile;
