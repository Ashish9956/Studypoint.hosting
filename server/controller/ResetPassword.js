const User = require("../models/user");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto=require("crypto");
//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
	try {
		  //get email from req body
		const email = req.body.email;
		 //check user for this email , email validation
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.json({
				success: false,
				message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
			});
		}
		 //generate token 
		const token = crypto.randomBytes(20).toString("hex");
         //update user by adding token and expiration time
		const updatedDetails = await User.findOneAndUpdate(
			{ email: email },
			{
				token: token,
				resetPasswordExpires: Date.now() + 3600000,
			},
			{ new: true }
		);
		console.log("DETAILS", updatedDetails);
          //create url
		const url = `http://localhost:3000/update-password/${token}`;
         //send mail containing the url
		await mailSender(
			email,
			"Password Reset",
			`Your Link for email verification is ${url}. Please click this url to reset your password.`
		);
        //return response
		res.json({
			success: true,
			message:
				"Email Sent Successfully, Please Check Your Email to Continue Further",
		});
	} catch (error) {
		return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Sending the Reset Message`,
		});
	}
};
//resetPassword\
// exports.resetPassword = async (req, res) => {
// 	try {
// 		 //data fetch
// 		const { password, confirmPassword, token } = req.body;
//         //validation
// 		if (confirmPassword !== password) {
// 			return res.json({
// 				success: false,
// 				message: "Password and Confirm Password Does not Match",
// 			});
// 		}
// 		//get userdetails from db using token
// 		const userDetails = await User.findOne({ token: token });
// 		//if no entry - invalid token
// 		if (!userDetails) {
// 			return res.json({
// 				success: false,
// 				message: "Token is Invalid",
// 			});
// 		}
// 		  //token time check   
// 		if (!(userDetails.resetPasswordExpires > Date.now())) {
// 			return res.status(403).json({
// 				success: false,
// 				message: `Token is Expired, Please Regenerate Your Token`,
// 			});
// 		}
// 		  //hash pwd
// 		const encryptedPassword = await bcrypt.hash(password, 10);
// 		 //password update
// 		await User.findOneAndUpdate(
// 			{ token: token },
// 			{ password: encryptedPassword },
// 			{ new: true }
// 		);
// 		//return response
// 		res.json({
// 			success: true,
// 			message: `Password Reset Successful`,
// 		});
// 	} catch (error) {
// 		return res.json({
// 			error: error.message,
// 			success: false,
// 			message: `Some Error in Updating the Password`,
// 		});
// 	}
// };
exports.resetPassword = async (req, res) => {
	try {
	  // 1. Get the new password, confirm password, and token from the user's request.
	  const { password, confirmPassword, token } = req.body;
  
	  // 2. Check if the new password matches the confirmation.
	  if (confirmPassword !== password) {
		return res.json({
		  success: false,
		  message: "Password and Confirm Password Do Not Match",
		});
	  }
  
	  // 3. Look up the user's details in the database using the reset token.
	  const userDetails = await User.findOne({ token: token });
      console.log(userDetails);
	  // 4. Check if the token has expired.
	  if (!(userDetails.resetPasswordExpires > Date.now())) {
		return res.status(403).json({
		  success: false,
		  message: "Token is Expired, Please Regenerate Your Token",
		});
	  }
  
	  // 5. Hash the new password and update it in the database.
	  const encryptedPassword = await bcrypt.hash(password, 10);
	  await User.findOneAndUpdate(
		{ token: token },
		{ password: encryptedPassword },
		{ new: true }
	  );
  
	  // 6. Send a response indicating the success of the password reset.
	  res.json({
		success: true,
		message: "Password Reset Successful",
	  });
	} catch (error) {
	  // Handle any errors and return an error response.
	  return res.json({
		error: error.message,
		success: false,
		message: "Some Error in Updating the Password",
	  });
	}
  };