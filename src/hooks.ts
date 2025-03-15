import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import {
  settingService,
  userService,
  cardService,
  contactService,
} from "service";

import { matchStatusBarColor } from "utils/device";
import { EventName, events, Payment } from "zmp-sdk";
import { useNavigate, useSnackbar } from "zmp-ui";

export function useMatchStatusTextColor(visible?: boolean) {
  const changedRef = useRef(false);
  useEffect(() => {
    if (changedRef.current) {
      matchStatusBarColor(visible ?? false);
    } else {
      changedRef.current = true;
    }
  }, [visible]);
}

const originalScreenHeight = window.innerHeight;

export function useVirtualKeyboardVisible() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const detectKeyboardOpen = () => {
      setVisible(window.innerHeight + 160 < originalScreenHeight);
    };
    window.addEventListener("resize", detectKeyboardOpen);
    return () => {
      window.removeEventListener("resize", detectKeyboardOpen);
    };
  }, []);

  return visible;
}

export function useToBeImplemented() {
  const snackbar = useSnackbar();
  return () =>
    snackbar.openSnackbar({
      type: "success",
      text: "Chức năng dành cho các bên tích hợp phát triển...",
    });
}

export function usePOSTAPIUserQueryInfoCMS() {
  const getData = async (params) => {
    try {
      const resp: any = await userService.UserQueryInfoCMS(params);

      return resp?.data || [];
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return {
    post: getData,
  };
}

export function useGetSetting(props?: { enabled?: boolean }) {
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  let params: typeof props = {};
  if (props) {
    params = props;
  }
  if (!("enabled" in params)) {
    params.enabled = true;
  }

  const getData = async () => {
    let _;
    try {
      setIsLoading(true);
      const resp: any = await settingService.GetSetting();

      _ = resp.data;
      setData(resp?.data || {});
      setIsSuccess(true);
    } catch {
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
    return _;
  };
  useEffect(() => {
    if (params?.enabled) {
      getData();
    }
  }, [params]);

  return {
    data,
    isLoading,
    isSuccess,
    refetch: getData,
  };
}

export function usePOSTAPICardUpdate() {
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const getData = async (params) => {
    try {
      setIsLoading(true);
      const resp: any = await cardService.CardUpdate(params);
      setData(resp?.data || []);
      setIsSuccess(true);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, isSuccess, post: getData };
}

export function useDeleteContact() {
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const getData = async (params) => {
    try {
      setIsLoading(true);
      const resp: any = await contactService.DeleteContact(params);
      setData(resp?.data || []);
      setIsSuccess(true);
    } catch (error) {
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, isSuccess, delete: getData };
}

export function useCreateContact() {
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const getData = async (params) => {
    try {
      setIsLoading(true);
      const resp: any = await contactService.CreateContact(params);
      setData(resp?.data || []);
      setIsSuccess(true);
    } catch (error) {
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, isSuccess, post: getData };
}
