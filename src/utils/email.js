const nodemailer = require("nodemailer");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const sendVerificationEmail = async (email, verificationLink) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 587,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const mailOptions = {
      from: ' "Dewn Support" <support@dewn.rog>',
      to: email,
      subject: "Verify your email",
      text: `Click the link to verify your email: ${verificationLink}`,
      html: `<p>Click the link to verify  your email: <a href="${verificationLink}">${verificationLink}</a></p>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending mail: ", error);
    throw new Error("Could not send verification email");
  }
};

module.exports = { sendVerificationEmail };
