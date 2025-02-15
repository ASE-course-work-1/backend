import Delivery from '../models/Delivery.js';
import Outlet from '../models/Outlet.js';

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
    const delivery = await Delivery.findById(req.params.deliveryId);
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });

    delivery.status = 'delivered';
    delivery.confirmedBy = req.user.id;
    await delivery.save();
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 