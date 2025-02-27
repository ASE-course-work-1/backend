import Outlet from '../models/Outlet.js';
import Request from '../models/Request.js';
import User from '../models/User.js';

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

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 

export const getUsers = async (req, res) => {
  try {
    const { role } = req.query; // Get the 'role' filter from query params

    let filter = {}; // Default filter is an empty object (all users)

    if (role) {
      filter.role = role; // If 'role' is provided, apply it as a filter
    }

    // Retrieve users based on the filter (role and/or other criteria)
    const users = await User.find(filter, '_id name email phone nic role'); // Including role in the response if needed
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

