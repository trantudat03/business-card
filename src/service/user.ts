import request, { requestDefault } from "utils/request";
import env from "config/app.config";

type TUserQueryInfoZalo = {
  userAccessToken: string;
  token: string;
  secretKey: string;
  locationCode: string;
};

type TUserQueryInfoCMS = {
  zaloAccessToken: string;
  zaloIdByOA: string;
  phoneNumber: string;
  zaloName: string;
  zaloIdByApp: string;
  testExpireToken?: boolean;
};

export const UserQueryInfoZalo = (params: TUserQueryInfoZalo) =>
  request(`${env.VITE_WEB_URL_API}/func-customer/get-zalo-user-info`, {
    method: "POST",
    data: params,
    headers: {
      // authApi: false,
    },
  });

export const UserQueryInfoCMS = (params: TUserQueryInfoCMS) =>
  request(`${env.VITE_WEB_URL_API}/api/func-customer/auth`, {
    method: "POST",
    data: params,
    headers: {
      // authApi: false,
    },
  });

export const GetCMSNewAccessToken = (params: {
  refreshToken: string;
  testExpireToken?: boolean;
}) =>
  requestDefault(`${env.VITE_WEB_URL_API}/func-customer/refresh-token`, {
    method: "POST",
    data: params,
    transformRequest: [
      function (data, headers) {
        if ("Authorization" in headers) delete headers.Authorization;
        return JSON.stringify(data);
      },
    ],
  });
