export type LoginWithZaloRequest = {
  zaloOaAccessToken?: string;
  phoneNumberToken?: string;
  zaloOaId?: string;
  zaloAppUserId?: string;
  zaloName?: string;
  testExpireToken?: boolean;
};

export type LoginWithZaloResponse = {
  hasLoggedInBefore?: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id?: number;
    zaloOaId?: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    joinedDate?: string;
    zaloAppUserId?: string;
    dob?: string;
    gender?: string;
  };
};
