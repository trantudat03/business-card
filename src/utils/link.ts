import env from "config/app.config";

export const handCreateLinkCardInfo = (cardId) => {
  // Bước 1: Tạo đường dẫn cơ sở với /card-info:cardId
  let baseUrl = `${env.VITE_ZALO_APP_URL}/card-info/${cardId}`;
  if (location.search) {
    const extraParams = location.search;
    // Thêm phần tham số vào sau baseUrl
    baseUrl += extraParams;
  }
  return baseUrl;
};

export const handExtractPath = (url) => {
  try {
    const path = new URL(url).pathname;
    const matched = path.match(/\/card-info\/[^/]+/);
    return matched ? matched[0] : null;
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
};
