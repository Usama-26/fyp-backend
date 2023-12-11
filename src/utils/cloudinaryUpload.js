const cloudinary = require("cloudinary").v2;
const cloudinaryUpload = async (file) => {
  try {
    const response = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return response;
  } catch (error) {
    return error.message;
  }
};
module.exports = cloudinaryUpload;
