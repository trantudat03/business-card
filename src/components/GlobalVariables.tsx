import * as hooks from "hooks";
import { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { appState, settingState, userState } from "state";
import { TUser } from "types/user";

export let useNavigateGlobal: NavigateFunction;
export let userTokensGlobal;
export const isDebugGlobal = {
  unfollowOA: false,
  CMSRefreshToken: false,
  isSaveUserDataOffline: false,
  status: {
    isActive: false,
    value: "USER_UNFOLLOWED_OA" as Partial<TUser["userStatus"]>,
  },
};
export let appSettingData;

export let setAppStateInfoGlobal;

const GlobalVariablesComponent = () => {
  const userInformation = useRecoilValue(userState);
  const [appSetting, setAppSetting] = useRecoilState(settingState);
  const setGlobal = useSetRecoilState(appState);

  const getSetting = hooks.useGetSetting({
    enabled: false,
  });

  useEffect(() => {
    updateAppSetting();
  }, []);

  const updateAppSetting = async () => {
    const data = await getSetting.refetch();
    if (data) {
      setAppSetting(data);
    }
  };

  useNavigateGlobal = useNavigate();
  userTokensGlobal = userInformation?.userTokens;
  appSettingData = appSetting;
  setAppStateInfoGlobal = setGlobal;

  return null;
};
export default GlobalVariablesComponent;
