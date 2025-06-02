import { Welcome } from "pages/index/welcome";
import React from "react";
import { useRecoilValue } from "recoil";
import { cardState, userState } from "state";
import { Box, Button, Header, Icon, Page } from "zmp-ui";
import "./styles.scss";
import { generatePath, useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "utils/constant";
import SettingItem from "components/SettingItem";
import mailIcon from "assets/svg/mail.svg"
import creditCard from "assets/svg/credit-card.svg"
import searchHistory from "assets/svg/search-history.svg"
const Profile = () => {
  const user = useRecoilValue(userState);
  const card = useRecoilValue(cardState);
  const avatar = user?.avatar;
  const name = user?.name;
  const navigate = useNavigate();
  return (
    <Page className="bg-white">
      <Welcome />
      <div className="profile">

        <div className="flex items-center justify-between  border border-slate-400 p-4 rounded-3xl">
            <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden">
              <img
                src={avatar}
                alt="profile-avatar"
                className="w-full h-full object-cover "
              />
            </div>
            <div>
              <p className="text-sm text-slate-700">Thông tin cá nhân</p>
              <p className="font-semibold text-lg">{name}</p>
            </div>
            </div>

            <div className="text-slate-500" >
              <Icon icon="zi-chevron-right" size={24}/>
            </div>
      </div>

        
        <div className="flex flex-col mt-4">

          <SettingItem 
            title="Danh thiếp của tôi"
            icon={creditCard}
            key={`myCard`}
            showChevron={true}
            onClick={() => {
              navigate(ROUTE_PATH.EDIT_PROFILE.path, {
                replace: ROUTE_PATH.EDIT_PROFILE.replace,
              });
            }}
          />
          <div className="h-[1px] w-full bg-slate-200 rounded-e-sm"></div>
          <SettingItem 
            title="Mã QR của tôi"
            icon={<Icon icon="zi-qrline" size={24} style={{color: "gray", fontWeight: "bold"}}/>}
            key={`myQR`} 
            showChevron={true} 
            onClick={() => {
              navigate(ROUTE_PATH.QR_CODE.path, {
                replace: ROUTE_PATH.QR_CODE.replace,
              });
            }}
          />
          <div className="h-[1px] w-full bg-slate-200 rounded-e-sm"></div>
          <SettingItem 
            title="Số điện thoại"
            description={user?.phoneNumber === '' || user?.phoneNumber === null ? "Chưa cập nhật": user?.phoneNumber}
            icon={<Icon icon="zi-call" size={24} style={{color: "gray", fontWeight: "bold"}}/>}
            key={`phoneNumber`}
            showChevron={true}
          />
          <div className="h-[1px] w-full bg-slate-200 rounded-e-sm"></div>
          <SettingItem 
            title="Email"
            description={`Chưa liên kết`}
            icon={mailIcon}
            key={`myEmail`} 
            showChevron={true} 
          />
          <div className="h-[1px] w-full bg-slate-200 rounded-e-sm"></div>
          <SettingItem 
            title="Lịch sử tìm kiếm"
            icon={searchHistory}
            key={`search-history`} 
            showChevron={true} 
          />
          
          {/* <div className={`profile__profile--category`} onClick={() => {}}>
            Giới thiệu bạn bè
          </div> */}
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
