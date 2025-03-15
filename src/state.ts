import { atom, selector } from "recoil";
import { TApp } from "types/common";
import { TSetting } from "types/setting";
import { TCard, TUser } from "types/user";
import { getUserInfo } from "zmp-sdk";

export const userState = atom<TUser>({
  key: "user",
  default: {
    referralCode: "",
    avatar: "",
    name: "",
    id: "",
    ZaloIdByApp: " ",
    phoneNumber: "",
    userStatus: "USER_NOT_LOGIN",
    userTokens: {
      cmsAccessToken: "",
      cmsRefreshToken: "",
      zaloAccessToken: "",
      zaloPhoneToken: "",
    },
    isLoading: false,
    actionZalo: "",
    shouldUpdate: false,
  },
});

export const cardState = atom<TCard>({
  key: "card", // Mỗi atom trong Recoil cần một key duy nhất
  default: {
    documentId: "",
    id: "",
    name: "",
    company: "",
    position: "",
    phone: "",
    email: "",
    slogan: "",
    socialMedia: [],
    user: {
      ZaloIdByApp: "",
      email: "",
      id: "",
      username: "",
    }, // Để đúng kiểu object { id, username, email }
    contacts: [], // Danh sách contacts theo TContact[]
  },
});

export const displayNameState = atom({
  key: "displayName",
  default: "",
});

export const contactState = atom<TCard[]>({
  key: "contact",
  default: [],
});

export const settingState = atom<TSetting>({
  key: "setting",
  default: {
    id: "",
    attributes: {
      url: "",
      version: "",
      title: "",
      description: "",
      createdAt: "",
      updatedAt: "",
      publishedAt: "",
    },
  },
});

export const appState = atom<TApp>({
  key: "app",
  default: {
    isLoading: false,
    error: [],
  },
});
