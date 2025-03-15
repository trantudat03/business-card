import { Route, RoutePath } from "types/common";

export const LANGUAGE = {
  VI: "vi",
  EN: "en",
};

export const ERROR_CODE = {
  TIMEOUT: "Request Timeout",
  TIMEOUT_LOCATION: "Vui lòng kiểm tra mạng hoặc đã bật GPS chưa (LOCATION)",
  TIMEOUT_ACCESS_TOKEN: "Vui lòng kiểm tra mạng (ACCESS_TOKEN)",
  TIMEOUT_PHONE: "Vui lòng kiểm tra mạng (PHONE)",
  TIMEOUT_DEVICE_ID: "Vui lòng kiểm tra mạng (DEVICE_ID)",
  TIMEOUT_FOLLOW_OA: "Vui lòng kiểm tra mạng (FOLLOW_OA)",
  TIMEOUT_GET_INFO: "Vui lòng kiểm tra mạng (GET_INFO)",
  TIMEOUT_PERMISSION: "Vui lòng kiểm tra mạng (PERMISSION)",
  ECONNABORTED: "ECONNABORTED",
  ERR_NETWORK: "ERR_NETWORK",
};

export const routes: Route[] = [];

export const ROUTE_PATH = {
  PROFILE: {
    path: "/profile",
    replace: true,
  },
  HOME: {
    path: "/home",
    replace: true,
  },
  ADD_CONTACT: {
    path: "/add-contact",
    replace: true,
  },
  EDIT_PROFILE: {
    path: "/edit-profile",
    replace: false,
  },
  CARD_INFO: {
    path: "/card-info/:id",
    replace: false,
  },
  QR_CODE: {
    path: "/qr-code",
    replace: false,
  },
};

export const ERROR_MES = {
  MANDATORY_FIELD: "Vui lòng nhập thông tin bắt buộc",
  MAIL_FIELD: "Email không hợp lệ",
  TIMEOUT_REQUEST: "Yêu cầu đã vượt quá thời gian chờ.",
  NETWORK_ERROR: "Mạng không ổn định, vui lòng thử lại",
  UNKNOWN_ERROR: "Đã xảy ra sự cố, vui lòng thử lại sau",
  OLD_ZALO_VERSION:
    "Phiên bản Zalo của bạn đã cũ. Vui lòng cập nhật lên phiên bản mới nhất để trải nghiệm đầy đủ các tính năng và cải thiện bảo mật.",
  NOT_FOLLOW_OA: "Vui lòng nhấn quan tâm OA để tiếp tục",
  FOLLOW_OA_LIMIT_REACHED: "Đã quá số lần yêu cầu quan tâm OA",
  FOLLOW_OA_FAILED: "Đã có lỗi xảy ra khi quan tâm OA",
};
export const LOCALSTORAGE = {
  userInformation: "user",
};

export const ISO8601_DATE_FORMAT = "YYYY-MM-DD";
export const UNITED_STATES_DATE_FORMAT = "DD/MM/YYYY";
