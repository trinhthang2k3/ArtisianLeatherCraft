const nodemailer = require("nodemailer");
const VerificationCode = require("../models/verificationCode");
// Function to send the verification email
async function sendVerificationEmail(email) {
  try {
    const verificationCode = Math.floor(Math.random()*(999999-100000+1)) + 100000;
    // Create a Nodemailer transporter using an SMTP server
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com", // Replace with your SMTP server hostname
      port: 587, // Replace with your SMTP server port
      secure: false, // Set to true if using a secure connection (e.g., TLS)
      auth: {
        user: "trinhducthang110@gmail.com", // Replace with your email address
        pass: "ducthang110@", // Replace with your email password or app-specific password
      },
    });

    // Define the email options
    const mailOptions = {
      from: "trinhducthang110@gmail.com", // Replace with your email address
      to: email,
      subject: "Email Verification",
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Email Verification</title>
        <style>
        body {
          background-color: #f7f7f7;
        }
    
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          text-align: center;
        }
    
        h1 {
          color: #333333;
        }
    
        .verification-code {
          font-size: 28px;
          color: #ff6600;
          margin-top: 40px;
          margin-bottom: 20px;
        }
    
        .note {
          font-size: 16px;
          color: #666666;
          margin-bottom: 40px;
        }
        </style>
      </head>
      <body>
        <h1>Email Verification</h1>
        <p>Your verification code is: <strong>${verificationCode}</strong></p>
        <p>If you input the wrong code, it will no longer be valid. Please request a new verification code if needed.</p>
        <p>This code will be deleted after 5 minutes</p>
      </body>
      </html>
    `,
  };
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    await VerificationCode.create({code:verificationCode});
  } catch (error) {
    console.log("Error occurred while sending email:", error);
    throw error;
  }
  return
}

module.exports = { sendVerificationEmail};
