import Gig from "../models/gigmodel.js";
import createError from "../utils/createError.js";
import APIFeatures from "../utils/apiFeatures.js";

export const createGig = async (req, res, next) => {

  try {
    const newGig = await Gig.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        gig: newGig
      }
    });
  } catch (err) {
    next(err);
  }
};
export const deleteGig = async (req, res, next) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};
export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) next(createError(404, "Gig not found!"));
    res.status(200).send(gig);
  } catch (err) {
    next(err);
  }
};
export const getGigs = async (req, res, next) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Gig.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const gigs = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: gigs.length,
      data: {
        gigs
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};