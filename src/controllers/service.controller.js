const Service = require("./../models/service.model");

function getServices(req, res) {
  try {
    const services = Service.find();

    res.status(200).json({
      message: success,
      data: services,
    });
  } catch (err) {
    res.status(400).json({
      message: "fail",
      error: err.message,
    });
  }
}

module.exports = { getServices };
