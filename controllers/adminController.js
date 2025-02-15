import Outlet from '../models/Outlet.js';
import Request from '../models/Request.js';

export const getOutletStatus = async (req, res) => {
  try {
    const outlets = await Outlet.aggregate([
      {
        $project: {
          name: 1,
          location: 1,
          capacity: 1,
          currentStock: 1,
          utilization: { $divide: ["$currentStock", "$capacity"] }
        }
      }
    ]);
    res.json(outlets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateReports = async (req, res) => {
  try {
    const report = await Request.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          latest: { $max: "$createdAt" }
        }
      }
    ]);
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 