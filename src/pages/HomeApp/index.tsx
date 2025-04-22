import { Welcome } from "pages/index/welcome";
import React, { Fragment, useEffect, useRef, useState } from "react"; // Assuming Tailwind is configured here
import { useRecoilState, useRecoilValue } from "recoil";
import { cardState, contactState, userState } from "state";
import { Icon, Input, Page } from "zmp-ui";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { cmsAxios } from "utils/axios";
import axios from "axios";
import request from "utils/request";
import { TContact } from "types/user";
import env from "config/app.config";
import { generatePath, useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "utils/constant";
import { openChat } from "zmp-sdk";
import { useModalStore } from "store/modal";
import NoData from "components/NoData";
import InfiniteScroll from "components/InfiniteScroll";
import CMSImage from "components/cmsImage";
import CardItem from "components/CardItem";
const fetchContacts = async ({ pageParam = 1, queryKey }) => {
  const [, searchTerm] = queryKey;
  const res = await request(
    `${import.meta.env.VITE_WEB_URL_API}/api/func-customer/get-contacts`,
    {
      method: "GET",
      params: { page: pageParam, pageSize: 2, searchTerm },
    }
  );
  return res.data; // Trả về dữ liệu
};
const HomeApp = () => {
  const user = useRecoilValue(userState);
  const card = useRecoilValue(cardState);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useInfiniteQuery({
    queryKey: ["contacts", searchTerm],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await request(
        `${import.meta.env.VITE_WEB_URL_API}/api/func-customer/get-contacts`,
        {
          method: "GET",
          params: { page: pageParam, pageSize: 6, searchTerm },
        }
      );

      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.pageCount) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    staleTime: 4000,
    refetchOnWindowFocus: false,
  });

  if (data) {
    console.log(data);
  }

  return (
    <Page className="flex flex-col flex-1 bg-white " hideScrollbar>
      <Welcome />
      <div className="p-4 h-full ">
        {/* Search Bar */}
        <div className=" relative">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="border-none rounded-full bg-slate-100 py-3 pr-24 pl-10 text-base outline-none w-full"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <div className="absolute left-2 top-2.5">
            <Icon icon="zi-search" />
          </div>
          <div className="absolute right-3 top-2.5 flex gap-5 ">
            <div>
              <Icon icon="zi-mic" />
            </div>
            <div>
              <Icon icon="zi-more-vert" />
            </div>
          </div>
        </div>

        <div className="items-center w-full justify-center flex my-2">
          <div className="flex items-center gap-6 text-lg text-slate-600 py-2">
            <div>
              <Icon
                icon="zi-add-user"
                size={24}
                style={{
                  fontWeight: 600,
                }}
              />
            </div>
            <span>Tạo liên hệ mới</span>
          </div>
        </div>

        <CardItem cardInfo={card} isMyCard={true} />

        {/* Call Log List */}
        <div>
          {/* <div className="flex justify-between items-center ">
            <p className="text-base font-medium">Danh sách liên hệ</p>
            <div
           
            >
              <Icon icon="zi-retry" className="text-blue-500" />
            </div>
          </div>
          <div className="w-full h-0.5 bg-slate-200 mx-auto mt-1"></div> */}
        </div>
        <div className="h-full pb-10">
          <InfiniteScroll
            load={fetchNextPage}
            hasMore={hasNextPage}
            loader={
              <div
                className="text-center pt-4"
                style={{
                  fontSize: "14px",
                  lineHeight: "22px",
                  color: "rgba(0,0,0,0.85)",
                }}
              >
                Đang tải thêm...
              </div>
            }
            endMessage={
              data ? (
                <div className="pt-4">
                  <NoData
                    text={
                      data?.pages[0]?.data?.length
                        ? "Hết danh thiếp!"
                        : "Không có danh thiếp nào!"
                    }
                  />
                </div>
              ) : null
            }
          >
            {isPending ? (
              <div className="flex justify-center">Loading...</div>
            ) : isError ? (
              <div className="text-center text-red-500">
                Đã xảy ra lỗi, vui lòng thử lại!
              </div>
            ) : data?.pages?.[0]?.pagination?.total > 0 ? (
              <div className="mt-6">
                {data.pages.map((group, i) => (
                  <Fragment key={i}>
                    {group.data.map((item, index) => (
                      <CardItem cardInfo={item.card} key={index} />
                    ))}
                  </Fragment>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-6"></div>
            )}
          </InfiniteScroll>
        </div>

        <div className="bg-white rounded-lg shadow-md"></div>
      </div>
    </Page>
  );
};

export default HomeApp;
