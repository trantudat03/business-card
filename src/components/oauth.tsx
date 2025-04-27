import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { cardState, userState } from "state";
import { EventName, events } from "zmp-sdk/apis";
import request from "utils/request";
// import { useGetUserInformation, useLoginWithZalo } from "hooks";
import { zaloService } from "service";
import { UserInfoType, UserTokens } from "types/user";
import { LoginWithZaloResponse } from "types/auth";
import { GlobalVariables } from "components";
import { useAuthStore } from "store/auth";
import { authorize } from "zmp-sdk";
import { isEmpty } from "lodash";
import * as hooks from "hooks";
import { ROUTE_PATH } from "utils/constant";
import GlobalLoading from "./GlobalLoading";
const Oauth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useRecoilState(userState);
  const [card, setCard] = useRecoilState(cardState);
  const UserQueryInfoCMS = hooks.usePOSTAPIUserQueryInfoCMS();
  const isHasPermission = async () => {
    const scopesRequest = ["scope.userPhonenumber", "scope.userInfo"];
    const scopes = await zaloService.requestGetSettingDevice();
    const hasAllPermissions = await scopesRequest.every((scope) =>
      scopes.includes(scope)
    );
    if (hasAllPermissions) {
      const data = await authorize({
        scopes: ["scope.userInfo", "scope.userPhonenumber"],
      });
    }
  };

  const getUserTokens = async (params: {
    name: string;
    id: string;
    idByOA: string;
  }) => {
    let _;
    try {
      const ZaloPhoneNumberToken =
        await zaloService.requestGetUserPhoneNumber();
      const ZaloAccessToken = await zaloService.requestAccessToken();
      let UserInfoCMS: any = {
        accessToken: user?.userTokens?.cmsAccessToken,
        refreshToken: user?.userTokens?.cmsRefreshToken,
      };
      const UserInfoCMSParams: any = {
        zaloAccessToken: ZaloAccessToken,
        phoneNumberToken: ZaloPhoneNumberToken,
        zaloName: params?.name,
        zaloIdByApp: params?.id,
        zaloIdByOA: params?.idByOA,
      };
      if (!isEmpty(ZaloAccessToken)) {
        UserInfoCMS = await UserQueryInfoCMS.post(UserInfoCMSParams);
      }
      console.log("usercms", UserInfoCMS);
      _ = {
        cmsId: UserInfoCMS.user?.id,
        ZaloIdByApp: UserInfoCMS.user?.ZaloIdByApp,
        ZaloAccessToken: ZaloAccessToken || "",
        ZaloPhoneToken: ZaloPhoneNumberToken || "",
        CMSAccessToken: UserInfoCMS?.accessToken || "",
        CMSRefreshToken: UserInfoCMS?.refreshToken || "",
        phoneNumber: UserInfoCMS.user.phoneNumber,
        card: UserInfoCMS.card,
        theme_cards: UserInfoCMS.user.theme_cards,
        UserFirstLogin: {
          hasLoggedInBefore: UserInfoCMS?.hasLoggedInBefore,
          isChangePhoneNumber: UserInfoCMS?.isChangePhoneNumber,
          oldPhoneNumber: UserInfoCMS?.oldPhoneNumber,
        },
      };
    } catch (error) {}
    return _;
  };

  const initOauth = async () => {
    setUser((prev) => {
      return {
        ...prev,
        isLoading: true,
      };
    });
    let status: Partial<UserInfoType["userStatus"]> = "USER_NOT_LOGIN";
    let userInfo: any = {};
    let userTokens = {} as any;
    await isHasPermission();
    userInfo = await zaloService.requestGetUserInfo();
    if (userInfo?.followedOA) status = "USER_FOLLOWED_OA";
    if (!userInfo?.followedOA) status = "USER_NOT_ACCEPTED_FOLLOWED_OA";
    userTokens =
      (await getUserTokens({
        name: userInfo?.name || "",
        id: userInfo?.id || "",
        idByOA: userInfo?.idByOA || "",
      })) || {};
    useAuthStore.setState({
      accessToken: userTokens?.CMSAccessToken,
    });
    setCard((prev) => {
      return {
        ...prev,
        ...userTokens.card,
      };
    });
    setUser((prev) => {
      return {
        ...prev,
        id: userTokens.cmsId.toString(),
        ZaloIdByApp: userTokens.ZaloIdByApp,
        phoneNumber: userTokens.phoneNumber,
        name: userInfo.name,
        avatar: userInfo.avatar,
        themesCard: userTokens.theme_cards,
        userIsAuthorization: false,
        UserRequestFollowOA: false,
        userStatus: status,
        userTokens: {
          ...prev.userTokens,
          zaloAccessToken: userTokens?.ZaloAccessToken,
          zaloPhoneToken: userTokens?.ZaloPhoneToken,
          cmsAccessToken: userTokens?.CMSAccessToken,
          cmsRefreshToken: userTokens?.CMSRefreshToken,
        },
        isLoading: false,
      };
    });
  };

  useEffect(() => {
    initOauth();
  }, []);

  useEffect(() => {
    console.log("newUser", user);

    if (
      user.id &&
      card.documentId &&
      location?.pathname.includes("/card-info")
    ) {
      return;
    } else {
      if (user.id) {
        navigate("/home");
      }
    }
  }, [user.id, card.documentId]);

  useEffect(() => {
    setUser((prev) => {
      return { ...prev, userIsAuthorization: false };
    });
    let CMSAccessToken = user?.userTokens?.cmsAccessToken;
    request.defaults.headers.common["Authorization"] =
      `Bearer ${CMSAccessToken}`;
    // UpdateProfile();
  }, [user?.userTokens?.cmsAccessToken]);

  return <>{user?.isLoading && <GlobalLoading />}</>;
};

export default Oauth;
