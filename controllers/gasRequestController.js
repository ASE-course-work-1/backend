import Request from '../models/Request.js';
import Outlet from '../models/Outlet.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/emailSender.js';
import { newRequestTemplate, statusUpdateTemplate } from '../utils/emailTemplates.js';

export const requestGas = async (req, res) => {
  try {
    const { outletId, quantity = 1, address } = req.body;
    const outlet = await Outlet.findById(outletId).populate('manager');
    
    if (!outlet || outlet.currentStock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const token = `TKN-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const request = await Request.create({
      consumerId: req.user.id,
      outletId,
      token,
      quantity,
      address,
      status: 'pending'
    });

    // Get consumer details
    const consumer = await User.findById(req.user.id);
    
    outlet.currentStock -= quantity;
    await outlet.save();

    // Send notification to outlet manager if exists
    if (outlet.manager?.email) {
      await sendEmail(
        outlet.manager.email,
        'New Gas Request Received',
        `New request from ${consumer.name}`,
        newRequestTemplate(consumer, request, outlet)
      );
    }

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

export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id)
      .populate('consumerId', 'email name')
      .populate({
        path: 'outletId',
        populate: { path: 'manager', select: 'name email' }
      });

    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    // Verify requesting manager is assigned to the outlet
    if (request.outletId.manager._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized for this outlet' });
    }

    request.status = status;
    await request.save();

    // Send email notification to consumer
    await sendEmail(
      request.consumerId.email,
      `Gas Request Status Update - ${status}`,
      `Your request (Token: ${request.token}) status has been updated to: ${status}`,
      statusUpdateTemplate(request.consumerId.name, status, request.token)
    );

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 