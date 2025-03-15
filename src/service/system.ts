import request from "utils/request";

type LogServer = {
  data: {
    code?: string;
    message?: string;
    metadata?: object;
  };
};

export const logError = (params: LogServer) => {
  params.data.code = String(params?.data?.code);
  return request(`${import.meta.env.VITE_WEB_URL_API}/api/logs`, {
    method: "POST",
    data: params,
  });
};

export const GetListTipsNAdvices = () =>
  request(
    `${
      import.meta.env.VITE_WEB_URL_API
    }/api/article-suggestions?page=1&pageSize=5`,
    {
      method: "GET",
    }
  );
