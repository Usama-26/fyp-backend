const Language = require("../models/language.model");
const catchAsync = require("../utils/catchAsync");

exports.getAllLanguages = catchAsync(async (req, res, next) => {
  const languages = await Language.find();
  res.status(200).json({
    status: "success",
    data: languages,
  });
});
