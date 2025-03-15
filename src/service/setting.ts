import request from "utils/request";

export const GetSetting = () =>
  request(
    `${
      import.meta.env.VITE_WEB_URL_API
    }/api/app-setting?populate[logo][fields][0]=url`,
    {
      method: "GET",
      params: {},
    }
  );
