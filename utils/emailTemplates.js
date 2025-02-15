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