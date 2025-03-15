import env from "config/app.config";
import { TContact } from "types/user";
import request from "utils/request";

export const DeleteContact = (params: TContact) =>
  request(`${env.VITE_WEB_URL_API}/api/contacts/${params.documentId}`, {
    method: "DELETE",
    headers: {
      authApi: true,
    },
  });

export const CreateContact = (params: TContact) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  return request(`${env.VITE_WEB_URL_API}/api/contacts`, {
    method: "POST",
    headers: {
      authApi: false,
      Authorization: false,
    },
    data: JSON.stringify({
      data: {
        card: params.card?.documentId,
        users_permissions_user: params.userDocumentId,
      },
    }),
  });
};
