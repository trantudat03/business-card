import { GlobalVariables } from "components";
import { useRecoilValue } from "recoil";
import { systemService } from "service";
import { userState } from "state";
import { ERROR_CODE } from "utils/constant";
import {
  getSetting,
  getSystemInfo,
  GetUserInfoReturns,
  requestUpdateZalo,
} from "zmp-sdk";
import {
  authorize,
  closeApp,
  followOA,
  getAccessToken,
  getDeviceIdAsync,
  getPhoneNumber,
  getUserInfo,
  openWebview,
  unfollowOA,
} from "zmp-sdk/apis";
const ZaloAPITimeout = "ZaloAPITimeout";
const fetchTimeout = function (
  promise,
  message = ERROR_CODE.TIMEOUT,
  name = ERROR_CODE.TIMEOUT,
  timeout = 150000
) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            JSON.stringify({
              api: name,
              code: ZaloAPITimeout,
              message: message,
            })
          ),
        timeout
      )
    ),
  ]);
};

const ErrorReport = async (error) => {
  let detail = error;
  if (JSON.stringify(error).includes(ZaloAPITimeout)) {
    detail = JSON.parse(error);
  }

  const code = String(detail?.code);
  let message = detail?.message;
  const state = {
    error: undefined as any,
  };

  if (code === "-203") {
    message = "Hành động này đã đạt đến giới hạn";
  }
  if (code === "-1400") {
    message = "Dữ liệu truyền vào không hợp lệ";
  }
  if (code === "-1403") {
    message = "Bạn không có quyền gọi api này";
  }
  if (code === "-1404") {
    message = "API này không được hỗ trợ trong phiên bản Zalo này";
  }
  if (code === "-1408") {
    message = "Hết thời gian yêu cầu. Vui lòng thử lại sau.";
  }
  if (code === "-2000") {
    message = "Lỗi không rõ. Vui lòng thử lại sau.";
  }
  if (code === "-2001") {
    message = "Không thể giải mã id. Vui lòng kiểm tra lại thông số của bạn.";
  }

  state.error = {
    code: detail?.api,
    message: message,
    status: detail?.code,
    data: {
      message: message,
      name: detail?.api,
      status: detail?.code,
    },
  };

  if (
    [
      ZaloAPITimeout,
      "-203",
      "-1400",
      "-1403",
      "-1404",
      "-1408",
      "-2000",
      "-2001",
    ].includes(String(state?.error?.status))
  ) {
    GlobalVariables.setAppStateInfoGlobal((prev) => {
      const error = [...prev.error];
      error.push(state.error);
      return { ...prev, error };
    });
    // GlobalVariables.useNavigateGlobal(
    //   {},
    //   {
    //     replace: false,
    //     state,
    //   },
    // );
  }

  // if ([ZaloAPITimeout, "-1404", "-1408"].includes(String(state?.error?.status))) {
  const ZaloDeviceID = await requestGetDeviceID();
  // TODO: Calling useRecoilValue here is so wrong
  // eslint-disable-next-line react-hooks/rules-of-hooks
  //   const userInformation = useRecoilValue(userState);
  systemService.logError({
    data: {
      code: `${detail?.code}`,
      message: detail?.message,
      metadata: {
        deviceId: ZaloDeviceID,
        remark: `${detail?.message} (${detail?.api}):code ${detail?.code}`,
        source: "App",
        phoneNumber: `${"11111111"}`,
      },
    },
  });
  // }
};

export const requestGetDeviceID = async () => {
  let _;
  try {
    const data = await fetchTimeout(
      requestDeviceID(),
      ERROR_CODE.TIMEOUT_DEVICE_ID,
      "requestGetDeviceID"
    );
    _ = data;
  } catch (error) {
    ErrorReport(error);
  }
  return _;
};

export const requestGetSettingDevice = async () => {
  try {
    const data = await fetchTimeout(
      getSetting({}),
      ERROR_CODE.TIMEOUT_DEVICE_ID,
      "requestGetSettingDevice"
    );
    return Object.keys(data?.authSetting).filter(
      (key) => !data?.authSetting[key]
    );
  } catch (error) {
    ErrorReport(error);
    return [];
  }
};

export const requestPermissionDevice = async (params) => {
  let _;
  try {
    const data = await fetchTimeout(
      authorize({
        scopes: params,
      }),
      ERROR_CODE.TIMEOUT_PERMISSION,
      "requestPermissionDevice"
    );
    _ = data;
  } catch (error) {
    ErrorReport(error);
  }
  return _;
};

export const requestGetUserInfo = async () => {
  try {
    const data = await fetchTimeout(
      getUserInfo(),
      ERROR_CODE.TIMEOUT_GET_INFO,
      "requestGetUserInfo"
    );

    return data?.userInfo as GetUserInfoReturns["userInfo"];
  } catch (error) {
    ErrorReport(error);
    return undefined;
  }
};

export const requestGetUserPhoneNumber = async () => {
  try {
    const { authSetting } = await getSetting();

    if (!authSetting["scope.userPhonenumber"]) {
      return undefined;
    }

    const data = await fetchTimeout(
      getPhoneNumber({}),
      ERROR_CODE.TIMEOUT_PHONE,
      "requestGetUserPhoneNumber"
    );

    return data?.token as string;
  } catch (error) {
    ErrorReport(error);
    return undefined;
  }
};

export const requestFollowOA = async () => {
  let _;
  try {
    const data = await fetchTimeout(
      followOA({
        id: import.meta.env.VITE_ZALO_OA_ID,
      }),
      ERROR_CODE.TIMEOUT_FOLLOW_OA,
      "requestFollowOA"
    );
    _ = data;
  } catch (error) {
    ErrorReport(error);
  }
  return _;
};

export const requestAccessToken = async () => {
  try {
    const data = await fetchTimeout(
      getAccessToken({}),
      ERROR_CODE.TIMEOUT_ACCESS_TOKEN,
      "requestAccessToken"
    );

    return data;
  } catch (error) {
    ErrorReport(error);
  }
};

export const requestUnFollowOA = async () => {
  let _;
  try {
    const data = await fetchTimeout(
      unfollowOA({
        id: import.meta.env.VITE_ZALO_OA_ID,
      }),
      ERROR_CODE.TIMEOUT_FOLLOW_OA,
      "requestUnFollowOA"
    );
    _ = data;
  } catch (error) {
    ErrorReport(error);
  }
  return _;
};

export const requestDeviceID = async () => {
  let _;
  try {
    const data = await fetchTimeout(
      getDeviceIdAsync(),
      ERROR_CODE.TIMEOUT_DEVICE_ID,
      "requestDeviceID"
    );
    _ = data;
  } catch (error) {
    ErrorReport(error);
  }
  return _;
};

export const requestOpenWebview = async (config) => {
  let _;
  try {
    const data = await fetchTimeout(
      openWebview(config),
      ERROR_CODE.TIMEOUT_DEVICE_ID,
      "requestOpenWebview"
    );
    _ = data;
  } catch (error) {
    ErrorReport(error);
  }
  return _;
};

export const requestCloseApp = async () => {
  let _;
  try {
    const data = await fetchTimeout(
      closeApp({}),
      ERROR_CODE.TIMEOUT_DEVICE_ID,
      "requestOpenWebview"
    );
    _ = data;
  } catch (error) {
    ErrorReport(error);
  }
  return _;
};

export const requestRequestUpdateZalo = async () => {
  let _;
  try {
    const data = await requestUpdateZalo({});
    _ = data;
  } catch (error) {
    ErrorReport(error);
  }
  return _;
};

export const requestGetSystemInfo = async () => {
  try {
    return getSystemInfo();
  } catch (error) {
    ErrorReport(error);
    return;
  }
};
