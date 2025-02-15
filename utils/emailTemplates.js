const logoBase64 = 'data:image/png;base64,<your-base64-encoded-image>';

export const otpTemplate = (otp) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GasByGas Verification</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8f9fa;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
        <div style="background: linear-gradient(135deg, #3498db, #2c3e50); padding: 32px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px;">
                🔐 GasByGas Verification
            </h1>
        </div>

        <div style="padding: 32px;">
            <p style="font-size: 16px; color: #4a5568; line-height: 1.6; margin: 0 0 24px 0;">
                Hello there! Please use the following verification code to complete your registration:
            </p>

            <div style="background-color: #f7fafc; border-radius: 8px; padding: 24px; text-align: center; margin: 0 0 32px 0;">
                <div style="font-size: 32px; font-weight: 700; color: #2c3e50; letter-spacing: 2px; margin: 12px 0;">
                    ${otp}
                </div>
                <div style="font-size: 14px; color: #e74c3c; font-weight: 500;">
                    ⏳ Expires in 10 minutes
                </div>
            </div>

            <div style="border-left: 4px solid #3498db; padding: 12px 20px; background-color: #f8f9fa; border-radius: 4px; margin: 24px 0;">
                <p style="font-size: 14px; color: #4a5568; margin: 0;">
                    💡 Tip: Never share this code with anyone. Our team will never ask for your verification code.
                </p>
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
</body>
</html>
`;

export const managerAssignmentTemplate = (managerName, outletDetails) => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
    <div style="background: linear-gradient(135deg, #3498db, #2c3e50); padding: 32px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px;">
        🏪 New Outlet Assignment
      </h1>
    </div>

    <div style="padding: 32px;">
      <p style="font-size: 16px; color: #4a5568; line-height: 1.6; margin: 0 0 24px 0;">
        Hello <strong>${managerName}</strong>,<br>
        You've been assigned to manage a new outlet. Here are the details:
      </p>

      <div style="background-color: #f7fafc; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 24px; margin-right: 12px;">🏪</span>
            <div>
              <div style="font-size: 14px; color: #718096;">Outlet Name</div>
              <div style="font-size: 16px; color: #2c3e50; font-weight: 600;">${outletDetails.name}</div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 24px; margin-right: 12px;">📍</span>
            <div>
              <div style="font-size: 14px; color: #718096;">Location</div>
              <div style="font-size: 16px; color: #2c3e50; font-weight: 600;">${outletDetails.location}</div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 24px; margin-right: 12px;">📞</span>
            <div>
              <div style="font-size: 14px; color: #718096;">Contact</div>
              <div style="font-size: 16px; color: #2c3e50; font-weight: 600;">${outletDetails.contact}</div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 24px; margin-right: 12px;">🛢️</span>
            <div>
              <div style="font-size: 14px; color: #718096;">Capacity</div>
              <div style="font-size: 16px; color: #2c3e50; font-weight: 600;">${outletDetails.capacity} cylinders</div>
            </div>
          </div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <a href="${process.env.BASE_URL}/manager-dashboard" style="background-color: #3498db; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; display: inline-block; transition: background-color 0.3s;">
          Access Manager Dashboard →
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
`; 