import axios from "axios";
import { ERROR_CODE } from "./constant";
import { isEmpty, omit } from "lodash";
import {
  globalTokens,
  setAppStateInfoGlobal,
} from "components/NavigateOutComponent";
import * as service from "service";
import env from "config/app.config";
import { GetCMSNewAccessToken } from "service/user";

// for multiple requests
let isRefreshing = false;
let failedQueue = <any>[];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom: any) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const request = axios.create({
  timeout: 15 * 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

const requestDefault = axios.create({
  timeout: 15 * 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.request.use(async (config: any) => {
  return config;
});

request.interceptors.response.use(
  (response: any) => {
    return response?.data;
  },
  async (error) => {
    const state = {
      error: undefined as any,
      userTokens: undefined as any,
    };
    try {
      state.error = {
        code: error.code,
        message: error.message,
        status: error?.response?.status,
        data: {
          message: error?.response?.data?.error?.message,
          name: error?.response?.data?.error?.name,
          status: error?.response?.data?.error?.status,
          api: error?.config?.url,
        },
      };
    } catch (err) {
    } finally {
      setAppStateInfoGlobal((prev) => {
        const error = [...prev.error];
        const itemExist = error.find(
          (_) => _?.data?.api === state?.error?.data?.api
        );
        if (!itemExist) error.push(state.error);
        return { ...prev, error };
      });
    }

    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(async function (resolve, reject) {
        try {
          const { data } = await GetCMSNewAccessToken({
            refreshToken: globalTokens?.CMSRefreshToken,
          });
          const { accessToken, refreshToken } = data?.data;
          state.userTokens = {
            CMSRefreshToken: refreshToken,
            CMSAccessToken: accessToken,
          };
          request.defaults.headers.common["Authorization"] =
            "Bearer " + accessToken;
          originalRequest.headers["Authorization"] = "Bearer " + accessToken;
          processQueue(null, accessToken);
          resolve(request(originalRequest));
        } catch (error: any) {
          processQueue(error, null);
          reject(error);
          const state = {
            error: {
              code: error?.code,
              message: error?.message,
              status: error?.response?.status,
              data: {
                message: error?.response?.data?.error?.message,
                name: error?.response?.data?.error?.name,
                status: error?.response?.data?.error?.status,
                api: error?.config?.url,
              },
            },
          };
          setAppStateInfoGlobal((prev) => {
            const error = [...prev.error];
            error.push(state.error);
            return { ...prev, error };
          });
        } finally {
          isRefreshing = false;
        }
      });
    }

    if (
      error?.code === ERROR_CODE.ECONNABORTED ||
      error?.code === ERROR_CODE.ERR_NETWORK
    ) {
      return Promise.reject(error);
    }
    return Promise.reject(error?.response?.data);
  }
);

requestDefault.interceptors.response.use(
  (response: any) => {
    return response?.data;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(async function (resolve, reject) {
        try {
          const { data } = await GetCMSNewAccessToken({
            refreshToken: globalTokens?.CMSRefreshToken,
          });
          const { accessToken, refreshToken } = data?.data;

          request.defaults.headers.common["Authorization"] =
            "Bearer " + accessToken;
          originalRequest.headers["Authorization"] = "Bearer " + accessToken;
          processQueue(null, accessToken);
          resolve(request(originalRequest));
        } catch (error: any) {
          processQueue(error, null);
          reject(error);
        } finally {
          isRefreshing = false;
        }
      });
    }

    if (
      error?.code === ERROR_CODE.ECONNABORTED ||
      error?.code === ERROR_CODE.ERR_NETWORK
    ) {
      return Promise.reject(error);
    }
    return Promise.reject(error?.response?.data);
  }
);

export default request;
export { requestDefault };
