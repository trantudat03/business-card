import axios from "axios";
import env from "config/app.config";
import request from "utils/request";

export async function uploadMultipleOrSingleAction(formData: FormData) {
  try {
    const response = await request.post(
      `${env.VITE_WEB_URL_API}/api/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 120000,
      }
    );

    return {
      uploadError: null,
      uploadSuccess: "Images uploaded successfully",
      data: response,
    };
  } catch (error: any) {
    console.log(error.message);
    return {
      uploadError: error.message,
      uploadSuccess: null,
    };
  }
}

export async function uploadImageCloudinary(formData: FormData) {
  try {
    const response = await axios.post(`${env.VITE_CLOUDINARY_URL}`, formData, {
      timeout: 60000,
    });

    return {
      uploadError: null,
      uploadSuccess: "Images uploaded successfully",
      data: response,
    };
  } catch (error: any) {
    console.log(error.message);
    return {
      uploadError: error.message,
      uploadSuccess: null,
    };
  }
}

// export async function LinkByUploadAction(prevState: any, formData: FormData) {
//   try {
//     // Convert formData into an object to extract data
//     // const data = Object.fromEntries(formData);

//     // Create a new FormData object to send to the server
//     const formDataToSend = new FormData();
//     formDataToSend.append("files", data.files); // The image file
//     formDataToSend.append("ref", data.ref); // The reference type for Food collection
//     formDataToSend.append("refId", data.refId); // The ID of the food entry
//     formDataToSend.append("field", data.field); // The specific field to which the image is linked, i.e., "cover"

//     // Make the API request to Strapi to upload the file and link it to the specific entry
//     const response = await fetch(`${STRAPI_URL}/api/upload`, {
//       method: "post",
//       body: formDataToSend,
//     });

//     // upload respone
//     const result = await response.json();

//     // Handle potential errors from the API response
//     if (result.error) {
//       return {
//         uploadError: result.error.message,
//         uploadSuccess: null,
//       };
//     }

//     // Return success if the upload and linking are successful
//     return {
//       uploadSuccess: "Image linked to a food successfully!",
//       uploadError: null,
//     };
//   } catch (error: any) {
//     // Catch any errors that occur during the process
//     return {
//       uploadError: error.message,
//       uploadSuccess: null,
//     };
//   }
// }
