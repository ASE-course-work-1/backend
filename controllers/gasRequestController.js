import Request from "../models/Request.js";
import Outlet from "../models/Outlet.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/emailSender.js";
import {
  newRequestTemplate,
  statusUpdateTemplate,
} from "../utils/emailTemplates.js";

export const requestGas = async (req, res) => {
  try {
    const { outletId, quantity = 1, address } = req.body;
    const outlet = await Outlet.findById(outletId).populate(
      "manager",
      "email name"
    );

    if (!outlet || outlet.currentStock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const token = `TKN-${Math.floor(100000 + Math.random() * 900000)}`;

    const request = await Request.create({
      consumerId: req.user.id,
      outletId,
      token,
      quantity,
      address,
      status: "pending",
    });

    // Get consumer details for email
    const consumer = await User.findById(req.user.id);

    outlet.currentStock -= quantity;
    await outlet.save();

    // Send notification to outlet manager if exists
    if (outlet.manager?.email) {
      await sendEmail(
        outlet.manager.email,
        "New Gas Request Received",
        `New request from ${consumer.name}`,
        newRequestTemplate(
          consumer,
          {
            ...request.toObject(),
            token,
            quantity,
            address,
            createdAt: new Date(),
          },
          outlet
        )
      );
    }

    // Send confirmation email to consumer with consistent template
    await sendEmail(
      consumer.email,
      "Gas Request Confirmation",
      `Your gas request has been received`,
      `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
        <div style="background: linear-gradient(135deg, #3498db, #2c3e50); padding: 32px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
            🛢️ Gas Request Confirmation
          </h1>
        </div>

        <div style="padding: 32px;">
          <p style="font-size: 16px; color: #4a5568; line-height: 1.6; margin: 0 0 24px 0;">
            Dear ${consumer.name},<br>
            Your gas request has been received successfully.
          </p>

          <div style="background-color: #f7fafc; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
            <div style="display: grid; gap: 16px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 24px;">🎫</span>
                <div>
                  <div style="font-size: 14px; color: #718096;">Request Token</div>
                  <div style="font-size: 18px; color: #2c3e50; font-weight: 600;">${token}</div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 24px;">🛢️</span>
                <div>
                  <div style="font-size: 14px; color: #718096;">Quantity</div>
                  <div style="font-size: 18px; color: #2c3e50; font-weight: 600;">${quantity} cylinder(s)</div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 24px;">📍</span>
                <div>
                  <div style="font-size: 14px; color: #718096;">Delivery Address</div>
                  <div style="font-size: 18px; color: #2c3e50; font-weight: 600;">${address}</div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 24px;">🏪</span>
                <div>
                  <div style="font-size: 14px; color: #718096;">Outlet</div>
                  <div style="font-size: 18px; color: #2c3e50; font-weight: 600;">${
                    outlet.name
                  }</div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 24px;">⏳</span>
                <div>
                  <div style="font-size: 14px; color: #718096;">Status</div>
                  <div style="font-size: 18px; color: #2c3e50; font-weight: 600;">Pending</div>
                </div>
              </div>
            </div>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="${process.env.BASE_URL}/track-request/${token}" 
              style="background-color: #3498db; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; display: inline-block; transition: background-color 0.3s;">
              Track Your Request →
            </a>
          </div>
        </div>

        <div style="background-color: #f8f9fa; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="font-size: 12px; color: #718096; margin: 8px 0;">
            Need help? Contact our support team at
            <a href="mailto:support@gasbygas.com" style="color: #3498db; text-decoration: none; font-weight: 500;">support@gasbygas.com</a>
          </p>
          <p style="font-size: 12px; color: #718096; margin: 8px 0;">
            © ${new Date().getFullYear()} GasByGas. All rights reserved.
          </p>
        </div>
      </div>
      `
    );

    res.status(201).json(request);
  } catch (error) {
    console.error("Gas request error:", error);
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
      token: req.params.token,
    }).populate("outletId");

    if (!request) return res.status(404).json({ message: "Token not found" });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id)
      .populate("consumerId", "email name")
      .populate({
        path: "outletId",
        populate: { path: "manager", select: "name email" },
      });

    if (!request) return res.status(404).json({ message: "Request not found" });

    // Verify requesting manager is assigned to the outlet
    if (request.outletId.manager._id.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized for this outlet" });
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

export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("consumerId", "name email phone")
      .populate("outletId", "name location district")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("consumerId", "name email phone")
      .populate("outletId", "name location district contact");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRequestsByOutlet = async (req, res) => {
  try {
    const { outletId } = req.params;
    const requests = await Request.find({ outletId })
      .populate("consumerId", "name email phone")
      .populate("outletId", "name location district contact")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getManagerOutletRequests = async (req, res) => {
  try {
    // Find the outlet where the logged-in manager is assigned
    const outlet = await Outlet.findOne({ manager: req.user.id });

    if (!outlet) {
      return res
        .status(404)
        .json({ message: "No outlet found for this manager" });
    }

    const requests = await Request.find({ outletId: outlet._id })
      .populate("consumerId", "name email phone")
      .populate("outletId", "name location district contact")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
