import Outlet from "../models/Outlet.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/emailSender.js";
import { managerAssignmentTemplate } from "../utils/emailTemplates.js";

export const createOutlet = async (req, res) => {
  try {
    const { name, location, district, contact, capacity, manager } = req.body;
    const outlet = await Outlet.create({
      name,
      location,
      district,
      contact,
      capacity,
      manager,
    });
    res.status(201).json(outlet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getOutlets = async (req, res) => {
  try {
    const outlets = await Outlet.find().populate("manager", "name email");
    res.json(outlets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOutlet = async (req, res) => {
  try {
    const outlet = await Outlet.findById(req.params.id).populate(
      "manager",
      "name email"
    );
    if (!outlet) return res.status(404).json({ message: "Outlet not found" });
    res.json(outlet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOutlet = async (req, res) => {
  try {
    const outlet = await Outlet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!outlet) return res.status(404).json({ message: "Outlet not found" });
    res.json(outlet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteOutlet = async (req, res) => {
  try {
    const outlet = await Outlet.findByIdAndDelete(req.params.id);
    if (!outlet) return res.status(404).json({ message: "Outlet not found" });
    res.json({ message: "Outlet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const assignManager = async (req, res) => {
  try {
    const { managerId } = req.body;
    const outlet = await Outlet.findByIdAndUpdate(
      req.params.id,
      { manager: managerId },
      { new: true, runValidators: true }
    ).populate("manager", "name email role");

    if (!outlet) {
      return res.status(404).json({ message: "Outlet not found" });
    }

    const managerUser = await User.findById(managerId);
    if (managerUser.role !== "outlet_manager") {
      return res.status(400).json({ message: "User is not an outlet manager" });
    }

    // Send assignment email
    await sendEmail(
      managerUser.email,
      "Outlet Manager Assignment Notification",
      `You've been assigned to manage ${outlet.name}`,
      managerAssignmentTemplate(managerUser.name, {
        name: outlet.name,
        location: outlet.location,
        district: outlet.district,
        contact: outlet.contact,
        capacity: outlet.capacity,
      })
    );

    res.json(outlet);
  } catch (error) {
    console.error("Manager assignment failed:", error);
    res.status(500).json({
      message: "Manager assigned but notification failed",
      error: error.message,
      outlet,
    });
  }
};

export const getOutletsPublic = async (req, res) => {
  try {
    const outlets = await Outlet.find().select(
      "name location district contact"
    );
    res.json(outlets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublicOutlets = async (req, res) => {
  try {
    const outlets = await Outlet.find({}, "name location district contact");
    res.json(outlets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUnassignedManagers = async (req, res) => {
  try {
    // Find all outlet managers
    const managers = await User.find({ role: "outlet_manager" });

    // Find all outlets with assigned managers
    const assignedOutlets = await Outlet.find({ manager: { $ne: null } });

    // Get array of assigned manager IDs
    const assignedManagerIds = assignedOutlets.map((outlet) =>
      outlet.manager.toString()
    );

    // Filter out managers who are assigned to outlets
    const unassignedManagers = managers.filter(
      (manager) => !assignedManagerIds.includes(manager._id.toString())
    );

    // Return only necessary fields
    const sanitizedManagers = unassignedManagers.map(
      ({ _id, name, email, phone }) => ({
        _id,
        name,
        email,
        phone,
      })
    );

    res.json(sanitizedManagers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUnassignedOutlets = async (req, res) => {
  try {
    const unassignedOutlets = await Outlet.find({ manager: null }).select(
      "name location district contact capacity"
    );
    res.json(unassignedOutlets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
