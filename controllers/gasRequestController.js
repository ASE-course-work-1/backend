import Request from '../models/Request.js';
import Outlet from '../models/Outlet.js';

export const requestGas = async (req, res) => {
  try {
    const { outletId } = req.body;
    const outlet = await Outlet.findById(outletId);
    
    if (!outlet || outlet.currentStock <= 0) {
      return res.status(400).json({ message: 'Gas not available at this outlet' });
    }

    const token = `TKN-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const request = await Request.create({
      consumerId: req.user.id,
      outletId,
      token,
      status: 'pending'
    });

    outlet.currentStock -= 1;
    await outlet.save();

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkAvailability = async (req, res) => {
  try {
    const outlets = await Outlet.find({ currentStock: { $gt: 0 } });
    res.json(outlets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTokenStatus = async (req, res) => {
  try {
    const request = await Request.findOne({
      consumerId: req.user.id,
      token: req.params.token
    }).populate('outletId');
    
    if (!request) return res.status(404).json({ message: 'Token not found' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 