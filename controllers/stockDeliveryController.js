import Delivery from '../models/Delivery.js';
import Outlet from '../models/Outlet.js';
import { sendEmail } from '../utils/emailSender.js';
import { 
  deliveryConfirmationManagerTemplate,
  deliveryConfirmationUserTemplate,
  scheduledDeliveryManagerTemplate,
  scheduledDeliveryUserTemplate,
  statusUpdateTemplate
} from '../utils/emailTemplates.js';
import Request from '../models/Request.js';

export const updateStock = async (req, res) => {
  try {
    const outlet = await Outlet.findById(req.params.outletId);
    if (!outlet) return res.status(404).json({ message: 'Outlet not found' });

    outlet.currentStock = req.body.stock;
    await outlet.save();
    res.json(outlet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const scheduleDelivery = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ 
      outletId: req.params.outletId,
      status: 'scheduled'
    }).populate('confirmedBy');
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const confirmDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.deliveryId)
      .populate({
        path: 'outletId',
        populate: { path: 'manager', select: 'email name' }
      })
      .populate({
        path: 'requestId',
        populate: { 
          path: 'consumerId',
          select: 'email name',
          model: 'User'
        }
      });

    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });

    if (!delivery.requestId?.consumerId) {
      throw new Error('Invalid request data - missing consumer information');
    }

    delivery.status = 'delivered';
    delivery.confirmedBy = req.user.id;
    await delivery.save();

    // Send email to outlet manager
    await sendEmail(
      delivery.outletId.manager.email,
      'Delivery Confirmed',
      `Delivery #${delivery._id} marked as delivered`,
      deliveryConfirmationManagerTemplate(delivery)
    );

    // Send email to consumer
    await sendEmail(
      delivery.requestId.consumerId.email,
      'Your Delivery is Complete',
      `Your gas delivery (Token: ${delivery.requestId.token}) has been completed`,
      deliveryConfirmationUserTemplate(delivery.requestId.consumerId.name, delivery.requestId.token)
    );

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDelivery = async (req, res) => {
  try {
    const { outletId, scheduledDate, requestId } = req.body;
    
    const newDelivery = new Delivery({
      outletId,
      scheduledDate,
      requestId,
      status: 'scheduled'
    });

    const savedDelivery = await newDelivery.save();
    
    // Send confirmation emails
    const outlet = await Outlet.findById(outletId).populate('manager', 'email name');
    const request = await Request.findById(requestId).populate('consumerId', 'email name');

    // Send to manager
    await sendEmail(
      outlet.manager.email,
      'New Delivery Scheduled',
      `Delivery scheduled for ${outlet.name} on ${new Date(scheduledDate).toLocaleString()}`,
      scheduledDeliveryManagerTemplate(outlet, savedDelivery)
    );

    // Send to consumer
    await sendEmail(
      request.consumerId.email,
      'Delivery Scheduled',
      `Your delivery is scheduled for ${new Date(scheduledDate).toLocaleString()}`,
      scheduledDeliveryUserTemplate(request.consumerId.name, savedDelivery)
    );

    res.status(201).json(savedDelivery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.deliveryId,
      { status },
      { new: true }
    )
    .populate({
      path: 'outletId',
      populate: { path: 'manager', select: 'email name' }
    })
    .populate({
      path: 'requestId',
      select: 'consumerId status token',
      populate: { 
        path: 'consumerId',
        select: 'email name',
        model: 'User'
      }
    });

    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
    
    if (!delivery.requestId || !delivery.requestId.consumerId) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    // Send status update emails
    await sendEmail(
      delivery.outletId.manager.email,
      'Delivery Status Updated',
      `Delivery ${delivery._id} status changed to ${status}`,
      statusUpdateTemplate(
        delivery.outletId.manager.name,
        status,
        delivery._id,
        delivery.requestId._id,
        delivery.requestId.token
      )
    );

    await sendEmail(
      delivery.requestId.consumerId.email,
      'Delivery Status Update',
      `Your delivery status has been updated to ${status}`,
      statusUpdateTemplate(
        delivery.requestId.consumerId.name,
        status,
        delivery._id,
        delivery.requestId._id,
        delivery.requestId.token
      )
    );

    res.json(delivery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 