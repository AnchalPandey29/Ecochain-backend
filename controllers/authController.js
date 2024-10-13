const User = require('../models/consumerSchema');
const otps = require('../models/otpSchema');
const nodemailer=require('nodemailer');

/*
##################### NODEMAILER CODE SECTION ###########################
*/

const transporter=nodemailer.createTransport({
  service:'gmail',
  auth:{
    user:'www.officialecochain@gmail.com',
    pass:'qikkpopzbiewbtpj'
  }
})







// Register User
const registerUser = async (req, res) => {
  try {
    console.log("Inside registerUser");

    const { name, email, mobile, password, role } = req.body;

    // Check if user with the email already exists
    console.log(req.body);


    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(422).json({ error: "Email already exists" });
    }

    // Create a new user
    const user = new User({ name, email, mobile, password, role });
    console.log("User created:", user);

    // Save the user to the database (triggers any pre-save hook)
    await user.save();
    console.log("User saved");

    // Generate authentication token for the user
    const token = await user.generateAuthToken();
    
    // Send response with user and token
    res.status(200).json({ message: "User Registered", user, token });
    console.log("Hurray, user registered successfully!");

  } catch (error) {
    console.error("Error:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by credentials
    const user = await User.findByCredentials(email, password);

    // Generate authentication token for the user
    const token = await user.generateAuthToken();

    // Send response with user and token
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(400).json({ error: 'Invalid login credentials' });
  }
};

//verify email
const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body; // Extract email properly
    if (!email) {
      return res.status(422).json({ message: "Please enter email" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(422).json({ message: "Please enter correct email or sign up" });
    }

    const OTP = Math.floor(100000 + Math.random() * 900000);
    const otpexpire = Date.now() + 5 * 60 * 1000; // Set expiration time to 5 minutes from now

    const mailOptions = {
      from: 'www.officialecochain@gmail.com',
      to: email,
      subject: 'OTP to reset password',
      text: `Your OTP for the account ${email} is ${OTP} and is valid only for 5 minutes.`,
    };

    const oldUser = await otps.findOne({ email });
    if (oldUser) {
      // Update the OTP and expiry if the user already exists in the OTP collection
      const updateInfo = await otps.findByIdAndUpdate(oldUser._id, { otp: OTP, otpexpire: otpexpire }, { new: true });
      if (!updateInfo) {
        return res.status(400).json({ error: "Unable to process for OTP system" });
      }
    } else {
      // Create new OTP entry if not found
      const newOtpEntry = new otps({ email, otp: OTP, otpexpire });
      await newOtpEntry.save();
    }

    // Send the OTP via email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    return res.status(200).json({ message: "OTP sent to the email address" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error: " + err });
  }
};


//verify otp
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(422).json({ message: "Please enter both email and OTP" });
    }

    // Find the user in the User model
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(422).json({ message: "Please enter correct email or sign up" });
    }

    // Find the OTP in the otps collection
    const otpEntry = await otps.findOne({ email });
    if (!otpEntry) {
      return res.status(422).json({ message: "OTP not found, please request a new one" });
    }

    const isOtpMatch = (otp === otpEntry.otp); // Ensure OTP is compared as string
    const isOtpExpired = Date.now() > otpEntry.otpexpire; // Check if current time is beyond expiration

    if (isOtpExpired) {
      return res.status(422).json({ message: "OTP Expired, please request a new one" });
    }

    if (!isOtpMatch) {
      return res.status(422).json({ message: "Invalid OTP" });
    }

    return res.status(200).json({ message: "OTP Matched" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

//reset-password
// const resetpassword=async(req,res)=>{
//   try{ 
//     const {email,password,otp}=req.body;
//     if(!email||!password||!otp){
//       return res.status(422).json({messsage:"An error occured please try again"});
//     }
//     const otpEntry = await otps.findOne({ email });
//     if (!otpEntry) {
//       return res.status(422).json({ message: "Malicious activity detected please try again later" });
//     }

//     const isOtpMatch = (otp === otpEntry.otp);
//     if(isOtpMatch){
//       const user=await User.findOne({email})
//     }

//   }catch(err){

//   }
// }


// Logout User
const logoutUser = async (req, res) => {
  try {
    // Filter out the token being used to logout
    req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);

    // Save the updated user object
    await req.user.save();

    res.status(200).send();
  } catch (error) {
    res.status(500).json({ error: 'Error during logout' });
  }
};

module.exports = { registerUser, loginUser, logoutUser, verifyEmail, verifyOtp };
