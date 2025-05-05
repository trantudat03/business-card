import React from "react";
import { useRecoilValue } from "recoil";
import { userState } from "state";
import { Box, Input, Sheet } from "zmp-ui";
import themeDefault from "assets/images/theme_default.png";
import env from "config/app.config";
import { TThemeCard } from "types/user";

const ChooseTheme = ({ themeCard }: { themeCard: any }) => {
  const user = useRecoilValue(userState);

  return (
    <div className="custom-bottom-sheet flex flex-col items-start p-6 gap-4 ">
      {/* <ChooseTheme themeCard={themeCard} /> */}
      <div className="flex flex-col gap-6">
        {themeCard ? (
          <div className="theme_info flex gap-6">
            <div className={`w-24 h-40 `}>
              <img
                src={`${env.VITE_WEB_URL_API + themeCard?.background?.url}`}
                alt="themeIMG"
                className="w-full object-cover border-2 border-slate-400"
              />
            </div>
            <div>
              <div className="">
                <span className="font-medium text-lg mr-1">Theme: </span>
                <span className="font-normal text-base capitalize">
                  {themeCard?.name}
                </span>
              </div>
              <div className="">
                <span className="font-medium text-lg mr-1">Information: </span>
                <span className="font-normal text-base capitalize">
                  {themeCard?.description}
                </span>
              </div>
              <div className="">
                <span className="font-medium text-lg mr-1">Layout: </span>
                <span className="font-normal text-base capitalize">
                  {themeCard?.layout}
                </span>
              </div>
              <div className="">
                <span className="font-medium text-lg mr-1">Status: </span>
                <span className="font-normal text-base capitalize">
                  {themeCard?.statusThemes}
                </span>
              </div>
              <div className="">
                <span className="font-medium text-lg mr-1">Text color: </span>
                <span className="font-normal text-base capitalize">
                  {themeCard?.textColor}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
        <div>
          <div className="flex flex-col gap-2 mb-2">
            <h3 className="text-lg font-semibold">Theme Default</h3>
            <div className="flex gap-4">
              {/* {themesDefault?.themes_default?.length > 0 ? (
                themesDefault?.themes_default?.map((item, i) => {
                  console.log(item);

                  return (
                    <div
                      className={`w-12 h-12 rounded-full  overflow-hidden ${themeCard?.documentId === item?.documentId ? `border-[3px] border-blue-600 ` : `border border-slate-300`}`}
                      onClick={() => {
                        setThemeCard(item);
                      }}
                      key={i}
                    >
                      <img
                        src={`${env.VITE_WEB_URL_API + item?.background?.url}`}
                        alt="themeIMG"
                        className="w-full object-cover"
                      />
                    </div>
                  );
                })
              ) : (
                <div>Don't have theme default</div>
              )} */}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Theme List</h3>
            <div className="flex gap-4">
              {user?.themesCard?.length > 0 ? (
                user?.themesCard.map((item, i) => {
                  console.log(item);

                  return (
                    <div
                      className={`w-12 h-12 rounded-full  overflow-hidden ${themeCard?.documentId === item?.documentId ? `border-[3px] border-blue-600 ` : `border border-slate-300`}`}
                      onClick={() => {
                        // setThemeCard(item);
                      }}
                      key={i}
                    >
                      <img
                        src={`${env.VITE_WEB_URL_API + item?.background?.url}`}
                        alt="themeIMG"
                        className="w-full object-cover"
                      />
                    </div>
                  );
                })
              ) : (
                <div>You don't have theme</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="">Confirm sds</div>
    </div>
  );
};

export default ChooseTheme;
