import { iteratee } from "lodash";

export type TUserStatus =
  | "USER_NOT_LOGIN"
  | "USER_UNFOLLOWED_OA"
  | "USER_FOLLOWED_OA"
  | "USER_NOT_ACCEPTED_FOLLOWED_OA"
  | "USER_ACCEPTING_FOLLOWED_OA"
  | "USER_NOT_ACCEPTED_PERMISSION"
  | "USER_ACCEPTED_PERMISSION"
  | "USER_ACCEPTING_PERMISSION"
  | "USER_NOT_VALID";

export type UserTokens = {
  zaloAccessToken?: string;
  zaloPhoneToken?: string;
  cmsAccessToken?: string;
  cmsRefreshToken?: string;
};

export interface TUser {
  referralCode: string;
  avatar: string;
  name: string;
  phoneNumber: string;
  id: string;
  userStatus: TUserStatus;
  userTokens: UserTokens;
  isLoading: boolean;
  actionZalo: "accept" | "reject" | "";
  shouldUpdate: boolean;
  ZaloIdByApp: string;
}

export interface TCard {
  documentId: string;
  id?: string; // ID của card (nếu có)
  name: string;
  company: string;
  position: string;
  phone: string;
  email: string;
  slogan?: string;
  socialMedia: TSocialMedia[]; // Component repeatable
  avatar?: {
    url: string;
  };
  // Quan hệ OneToOne với User
  user?: {
    id: string;
    username: string;
    email: string;
    ZaloIdByApp: string;
  };

  // Quan hệ OneToMany với Contact
  contacts?: TContact[];
  action?: string;
  contactId?: string; // dung de xoa contactId (chưc nang quen danh thiep)
}

export interface TContact {
  documentId?: string;
  id?: number;
  card?: TCard;
  userDocumentId?: string;
}

// Interface cho component socialMedia
export interface TSocialMedia {
  name: string;
  url: string;
}

// Interface cho Contact (tùy chỉnh dựa vào schema của Contact)
// export interface TContact {
//   id: string;
//   name: string;
//   phone: string;
//   email?: string;
// }

export type userStatus =
  | "USER_NOT_LOGIN"
  | "USER_UNFOLLOWED_OA"
  | "USER_FOLLOWED_OA"
  | "USER_NOT_ACCEPTED_FOLLOWED_OA"
  | "USER_NOT_ACCEPTED_PERMISSION"
  | "USER_ACCEPTED_PERMISSION"
  | "USER_ACCEPTING_PERMISSION"
  | "USER_ACCEPTING_FOLLOWED_OA"
  | "USER_NOT_VALID";

export interface UserInfoType {
  avatar: string;
  name: string;
  id: string;
  followedOA: boolean;
  idByOA: string;
  userInfoCMS: { [key: string]: any; Children?: any[] };
  userStatus: userStatus;
  userTokens: {
    ZaloAccessToken: string;
    ZaloPhoneToken: string;
    CMSAccessToken: string;
    CMSRefreshToken: string;
  };
  UserTrackingActions: {};
  UserRequestPermission: boolean;
  UserRequestFollowOA: boolean;
  UserRequestGetProfile: boolean;
  userIsAuthorization: boolean;
  userIsReAuthorization: boolean;
  UserFirstLogin: {
    hasLoggedInBefore: boolean;
    isChangePhoneNumber: boolean;
    oldPhoneNumber: string;
  };
  isLoading: boolean;
}
