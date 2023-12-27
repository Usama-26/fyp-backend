const cloudinary = require("cloudinary").v2;
const cloudinaryUpload = async (file, options = {}) => {
  try {
    const response = await cloudinary.uploader.upload(file, {
      ...options,
      resource_type: "auto",
      use_filename: true,
      unique_filename: true,
    });

    return response;
  } catch (error) {
    return error.message;
  }
};
module.exports = cloudinaryUpload;
