import { useQuery } from "@tanstack/react-query";
import env from "config/app.config";
import React from "react";
import { cmsAxios } from "utils/axios";
import request from "utils/request";
import defaultImage from "assets/images/defaultAvatar.png";

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
  const {
    data: imageUrl,
    isLoading,
    isError,
  } = useQuery({
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

  if (isError) {
    return <img src={defaultImage} alt={alt} className={className} />;
  }

  return (
    <img
      src={`${imageUrl?.[fieldName]?.url}`}
      alt={alt}
      className={className}
    />
  );
};

export default CMSImage;
