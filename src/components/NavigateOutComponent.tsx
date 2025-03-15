import { useNavigate, NavigateFunction } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState, appState } from "state";

export let globalNavigate: NavigateFunction;
export let globalTokens;
export let setAppStateInfoGlobal;

const NavigateOutComponent = () => {
  const [userInformation, setUserInformation] = useRecoilState(userState);
  const [appStateInfo, setAppStateInfo] = useRecoilState(appState);
  globalNavigate = useNavigate();
  globalTokens = userInformation?.userTokens;
  setAppStateInfoGlobal = setAppStateInfo;

  return null;
};
export default NavigateOutComponent;
