import { useQuery } from "@tanstack/react-query";
import env from "config/app.config";
import React from "react";
import { cmsAxios } from "utils/axios";
import request from "utils/request";

type CMSImageProps = {
  fieldName: string;
  alt?: string;
  className?: string;
};

const CMSImage = ({
  fieldName,
  alt = "CMS Image",
  className,
}: CMSImageProps) => {
  const { data: imageUrl, isLoading } = useQuery({
    queryKey: ["cmsImage", fieldName],
    queryFn: async () => {
      const res = await request(
        `${import.meta.env.VITE_WEB_URL_API}/api/app-setting?populate[defaultAvatar][fields][0]=url`
      );

      return res.data;
    },
  });

  if (isLoading) {
    return null;
  }

  return (
    <img
      src={`${env.VITE_WEB_URL_API}${imageUrl?.[fieldName]?.url}`}
      alt={alt}
      className={className}
    />
  );
};

export default CMSImage;
