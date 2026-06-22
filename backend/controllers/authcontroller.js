const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require("../models/usermodel");
const TempuserModel = require("../models/tempusermodel");
const OtpModel = require("../models/otpmodel");
const nodemailer = require("nodemailer");

const getEmailConfig = () => ({
    user: process.env.GMAIL_USER?.trim(),
    // Gmail App Passwords are often copied with spaces. Remove them before SMTP auth.
    pass: process.env.GMAIL_PASS?.replace(/\s/g, ''),
    host: process.env.SMTP_HOST?.trim() || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : true
});

const hasEmailConfig = () => {
    const { user, pass } = getEmailConfig();
    return Boolean(user && pass);
};

const getSafeEmailErrorDetails = (err) => ({
    code: err?.code,
    command: err?.command,
    responseCode: err?.responseCode,
    response: err?.response
});

const getEmailErrorMessage = (err) => {
    const authFailed = [401, 403, 454, 534, 535, 550, 553, 554].includes(err?.responseCode);

    if (authFailed || ['EAUTH', 'EENVELOPE'].includes(err?.code)) {
        return 'Email OTP failed. Please check GMAIL_USER and the Gmail App Password in Render environment variables. Use a Gmail App Password, not your normal Gmail password.';
    }

    if (err?.code === 'ECONNECTION' || err?.code === 'ETIMEDOUT') {
        return 'Email OTP failed because the server could not connect to Gmail SMTP. Please try again shortly.';
    }

    return 'Error sending email. Please check the server email settings and try again.';
};

const createEmailTransporter = () => {
    const { user, pass, host, port, secure } = getEmailConfig();

    if (!user || !pass) {
        throw new Error('Email service is not configured. Please set GMAIL_USER and GMAIL_PASS.');
    }

    return nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
            user,
            pass
        }
    });
};
// Authorization and intial process routes
// You can also add a simple controller for password change/ forgot passwprd feature by sending an confirmation email to the registered email


// @desc    Sign up
// @route   Post /signup
// @access  Private
const signup = async (req, res) => {
    try {
        const { handle, name, email, password } = req.body;
         if (!hasEmailConfig()) {
            return res.status(503).json({
                message: "Signup is temporarily unavailable because email OTP is not configured on the server.",
                success: false
            });
        }

        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({
                message: 'User already exists with the email, you can login',
                success: false
            });
        }

        await TempuserModel.deleteMany({ email });
        await OtpModel.deleteMany({ email });

        const hashedPassword = await bcrypt.hash(password, 10);

        const tempuserModel = new TempuserModel({
            handlename: handle,
            username: name,
            email,
            password: hashedPassword
        });
        await tempuserModel.save();

 
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        await OtpModel.create({ email, otp });



        try {
              const transporter = createEmailTransporter();
            await transporter.sendMail({
                 from: getEmailConfig().user,
                to: email,
                subject: "Verify your email",
                html: `<h2>Verify your ZCoder account</h2><p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`
            });
            console.log("OTP sent:", otp);
        } catch (err) {
             console.error("Signup OTP email failed:", getSafeEmailErrorDetails(err));
            await TempuserModel.deleteMany({ email });
            await OtpModel.deleteMany({ email });
            return res.status(500).json({ 
                message: getEmailErrorMessage(err),
                success: false 
            });
        }

        const jwtToken = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: "OTP sent successfully to your email! Please verify.",
            success: true,
            jwtToken: jwtToken
        });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Handle already exists'
            });
        }

        res.status(500).json({
            message: err.message || 'Internal Server Error',
            success: false
        });
    }
}

// @desc    Verify the otp
// @route   Post /otpverify
// @access  Private
const otpverify = async (req, res) => {
    try {
        const { token, otp } = req.body;

        if (!token || !otp) {
            return res.status(400).json({
                message: 'Missing token or OTP',
                success: false 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        const otpdoc = await OtpModel.findOne({ email });
        if (!otpdoc) {
            return res.status(409).json({ 
                message: 'OTP Expired or Invalid', 
                success: false 
            });
        }

        if (otpdoc.otp !== otp) {
            return res.status(403).json({ 
                message: 'OTP is incorrect', 
                success: false 
            });
        }

        const tempuserdoc = await TempuserModel.findOne({ email });
        if (!tempuserdoc) {
            return res.status(404).json({ 
                message: 'Timed out ! Sign up again', 
                success: false 
            });
        }

        const userModel = new UserModel({
            handlename: tempuserdoc.handlename,
            username: tempuserdoc.username,
            email: tempuserdoc.email,
            password: tempuserdoc.password
        });

        await userModel.save();

       

        try {
               const transporter = createEmailTransporter();
            await transporter.sendMail({
            from: getEmailConfig().user,
            to: email,
            subject: "Welcome to ZCoder!",
            html: `
                <h2>Hi ${tempuserdoc.username},</h2>
                <p>🎉 Welcome to <b>ZCoder</b> - your space to learn, code, and grow with a vibrant community of coders!</p>
                <p>We're excited to have you on board. Start exploring problems, sharing your solutions, and collaborating now!</p>
                <br/>
                <p>Happy Coding,<br/>ZCoder Team</p>
            `
            });

            console.log("Welcome email sent!");

        } 
        catch (err) {
            console.error("Welcome email failed:", getSafeEmailErrorDetails(err));
        }


        return res.status(201).json({ 
            message: 'Signup successful', 
            success: true 
        });

    } catch (err) {
        return res.status(500).json({
            message: 'Invalid Token',
            success: false
        });
    }
};


// @desc    Resend OTP
// @route   Post /resendotp
// @access  Private
const resendOtp = async (req, res) => {
    try {

        const { otptoken } = req.body;
          if (!hasEmailConfig()) {
            return res.status(503).json({
                message: "OTP resend is temporarily unavailable because email is not configured on the server.",
                success: false
            });
        }

        if (!otptoken) {
            return res.status(400).json({
                message: "Missing OTP token",
                success: false
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(otptoken, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({
                message: "Invalid or expired OTP token",
                success: false
            });
        }

        const email = decoded.email;

        const tempUser = await TempuserModel.findOne({ email });
        if (!tempUser) {
            return res.status(404).json({
                message: "Timed out ! Please sign up again.",
                success: false
            });
        }

        const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
        await OtpModel.deleteMany({ email });
        await OtpModel.create({ email, otp: newOtp });

 const transporter = createEmailTransporter();
        await transporter.sendMail({
              from: getEmailConfig().user,
            to: email,
            subject: "Your New OTP for ZCoder",
            html: `<h3>Your new OTP is <b>${newOtp}</b>. It expires in 5 minutes.</h3>`
        });

        const newToken = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            message: "New OTP sent to your email.",
            otptoken: newToken,
            success: true
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message || "Internal server error",
            success: false
        });
    }
};


// @desc    Login
// @route   Post /login
// @access  Private
const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        const errorMsg = `Authorization failed!`;

        if (!user) {
            return res.status(403).json({
                message: `${errorMsg} Email doesn't exist`,
                success: false
            });
        }


        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({
                message: `${errorMsg} Password is incorrect`,
                success: false
            });
        }

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '10d' }
        );

        return res.status(200).json({
            message: "Logged in Successfully",
            success: true,
            jwtToken,
            user: {
                handlename: user.handlename,
                username: user.username,
                email: user.email,
                _id: user._id,
                description: user.description,
                profilePic: user.profilePic,
                bookmarks: user.bookmarks,
                solutions: user.solutions
            }
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message || "Internal server error",
            success: false
        });
    }
};

module.exports = {
    signup,
    login,
    otpverify,
    resendOtp
}
