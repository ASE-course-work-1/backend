import Outlet from '../models/Outlet.js';
import User from '../models/User.js';

export const createOutlet = async (req, res) => {
  try {
    const { name, location, district, contact, capacity, manager } = req.body;
    const outlet = await Outlet.create({ 
      name, 
      location,
      district,
      contact,
      capacity,
      manager 
    });
    res.status(201).json(outlet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getOutlets = async (req, res) => {
  try {
    const outlets = await Outlet.find().populate('manager', 'name email');
    res.json(outlets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOutlet = async (req, res) => {
  try {
    const outlet = await Outlet.findById(req.params.id).populate('manager', 'name email');
    if (!outlet) return res.status(404).json({ message: 'Outlet not found' });
    res.json(outlet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOutlet = async (req, res) => {
  try {
    const outlet = await Outlet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!outlet) return res.status(404).json({ message: 'Outlet not found' });
    res.json(outlet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteOutlet = async (req, res) => {
  try {
    const outlet = await Outlet.findByIdAndDelete(req.params.id);
    if (!outlet) return res.status(404).json({ message: 'Outlet not found' });
    res.json({ message: 'Outlet deleted successfully' });
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
    ).populate('manager', 'name email role');

    if (!outlet) {
      return res.status(404).json({ message: 'Outlet not found' });
    }

    // Verify manager role
    const managerUser = await User.findById(managerId);
    if (managerUser.role !== 'outlet_manager') {
      return res.status(400).json({ message: 'User is not an outlet manager' });
    }

    res.json(outlet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getOutletsPublic = async (req, res) => {
  try {
    const outlets = await Outlet.find().select('name location district contact');
    res.json(outlets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublicOutlets = async (req, res) => {
  try {
    const outlets = await Outlet.find({}, 'name location district contact');
    res.json(outlets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 