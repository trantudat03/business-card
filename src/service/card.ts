import env from "config/app.config";
import { TCard, TContact } from "types/user";
import request from "utils/request";

export const CardUpdate = (params: TCard) =>
  request(`${env.VITE_WEB_URL_API}/api/func-customer/update-card`, {
    method: "POST",
    data: params,
    headers: {
      authApi: true,
    },
  });

export const CheckAction = (carId: string) =>
  request(`${env.VITE_WEB_URL_API}/api/func-customer/check-action`, {
    method: "POST",
    data: carId,
    headers: {
      authApi: true,
    },
  });
