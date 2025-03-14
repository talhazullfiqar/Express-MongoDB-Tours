// const mongoose = require("mongoose");
const Tour = require("../model/tourModel");
const HttpError = require("../error/Error");

//* GET ALL THE TOURS
async function getTours(req, res, next) {
  try {
    const allTours = await Tour.find();
    res.status(200).json({ status: "✅ Success", allTours });
  } catch (err) {
    const error = new HttpError(400, "Failed to fetch tours");
    return next(error);
  }
}

//* GET TOUR BY ID
async function getToursById(req, res, next) {
  const tourId = req.params.tid;

  if (!mongoose.Types.ObjectId.isValid(tourId)) {
    const error = new HttpError(400, `Invalid tour ID format: ${tourId}`);
    return next(error);
  }

  try {
    const oneTour = await Tour.findById(tourId).exec();
    if (!oneTour) {
      const error = new HttpError(404, `No Tour Found by id: ${tourId}`);
      return next(error);
    }
    res.status(200).json({ status: "✅ Success", oneTour });
  } catch (err) {
    const error = new HttpError(500, "Failed to fetch tours");
    return next(error);
  }
}

//* CREATE A NEW TOUR
async function createTour(req, res, next) {
  const { name, rating, price } = req.body;
  const newTour = new Tour({ name, rating, price });
  try {
    await newTour.save();
    res.status(201).json({ status: "✅ Success", newTour });
  } catch (err) {
    const error = new HttpError(500, "Failed to create tours");
    return next(error);
  }
}

//* UPDATE TOUR BY ID
async function updateTourById(req, res, next) {
  const tourId = req.params.tid;
  const { name } = req.body;

  if (!mongoose.Types.ObjectId.isValid(tourId)) {
    return next(new HttpError(400, `Invalid tour ID format: ${tourId}`));
  }

  try {
    const updateTour = await Tour.findByIdAndUpdate(
      tourId,
      { name },
      { new: true, runValidators: true }
    );

    if (!updateTour) {
      const error = new HttpError(404, `No Tour Found with ID: ${tourId}`);
      return next(error);
    }

    res.status(200).json({ status: "✅ Success", updateTour });
  } catch (err) {
    const error = new HttpError(500, "Failed to create tours");
    return next(error);
  }
}

//* DELETE TOUR BY ID
async function deleteTourById(req, res, next) {
  const tourId = req.params.tid;

  if (!mongoose.Types.ObjectId.isValid(tourId)) {
    return next(new HttpError(400, `Invalid tour ID format: ${tourId}`));
  }

  try {
    const deletedTour = await Tour.findByIdAndDelete(tourId);

    if (!deletedTour) {
      return next(new HttpError(404, `No Tour Found with ID: ${tourId}`));
    }

    res.status(200).json({ status: "✅ Delected Successfully" });
  } catch (err) {
    const error = new HttpError(500, "Failed to create tours");
    return next(error);
  }
}

//* DELETE ALL THE TOURS
async function deleteTours(req, res, next) {
  try {
    const deletedResult = await Tour.deleteMany({});

    if (deletedResult.deletedCount === 0) {
      return next(new HttpError(404, "No tours found to delete"));
    }

    return res.status(200).json({
      status: "✅ Deleted Successfully",
      deletedCount: deletedResult.deletedCount,
    });
  } catch (err) {
    const error = new HttpError(500, "Failed to create tours");
    return next(error);
  }
}

//? EXPORTING FUNCTION
exports.getTours = getTours;
exports.getToursById = getToursById;
exports.createTour = createTour;
exports.updateTourById = updateTourById;
exports.deleteTourById = deleteTourById;
exports.deleteTours = deleteTours;
