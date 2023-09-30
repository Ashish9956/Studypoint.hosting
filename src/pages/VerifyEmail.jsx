import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"
import { setLoading } from "../slices/authSlice";
import { endpoints } from "../services/apis";
import { apiConnector } from "../services/apiconnector";
const { SIGNUP_API,SENDOTP_API}=endpoints;
function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const { signupData, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Only allow access of this route when user has filled the signup form
    if (!signupData) {
      navigate("/signup");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
//   async function signUp(accountType,
//     firstName,
//     lastName,
//     email,
//     password,
//     confirmPassword,
//     otp,
//     navigate){
//     const toastId = toast.loading("Loading...")
//     dispatch(setLoading(true));
//     try {
//         const response = await apiConnector("POST", SIGNUP_API, {
//           accountType,
//           firstName,
//           lastName,
//           email,
//           password,
//           confirmPassword,
//           otp,
//         })
  
//         console.log("SIGNUP API RESPONSE............", response)
  
//         if (!response.data.success) {
//           throw new Error(response.data.message)
//         }
//         toast.success("Signup Successful")
//         navigate("/login")
//       } catch (error) {
//         console.log("SIGNUP API ERROR............", error)
//         toast.error("Signup Failed")
//         navigate("/signup")
//       }
//       dispatch(setLoading(false))
//       toast.dismiss(toastId)
//     }
async function signUp(
    accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate
  ) {
    const toastId = toast.loading("Loading...");
    try {
      // Show loading toast

  
      // Send a request to the signup API
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      });
  
      // Check if the response indicates success
      if (response.data.success) {
        // Successful signup
        toast.success("Signup Successful");
  
        // Navigate to the login page after successful signup
        navigate("/login");
      } else {
        // Signup failed, show error toast
        toast.error(response.data.message || "Signup Failed");
  
        // Navigate back to the signup page
        navigate("/signup");
      }
    } catch (error) {
      console.error("SIGNUP API ERROR:", error);
      // Show error toast
      toast.error("Signup Failed");
    } finally {
      // Hide loading toast
      toast.dismiss(toastId);
    }
  }
  
    async function sendOtp(email, navigate) {
        //   Show loading toast
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true))
    try {
        const response = await apiConnector("POST", SENDOTP_API, {
          email,
          checkUserPresent: true,
        })
        console.log("SENDOTP API RESPONSE............", response)
    
        console.log(response.data.success)
    
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
    
        toast.success("OTP Sent Successfully")
        navigate("/verify-email")
      } catch (error) {
        console.log("SENDOTP API ERROR............", error)
        toast.error("Could Not Send OTP")
      }
      finally {
      // Hide loading toast
      dispatch(setLoading(false))
      toast.dismiss(toastId)
    }
    }
  const handleVerifyAndSignup = (e) => {
    e.preventDefault();
    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = signupData;

    signUp(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        navigate
      );
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center">
      {loading ? (
        <div>
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">
            Verify Email
          </h1>
          <p className="text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100">
            A verification code has been sent to you. Enter the code below
          </p>
          <form onSubmit={handleVerifyAndSignup}>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 6px",
              }}
            />
            <button
              type="submit"
              className="w-full bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900"
            >
              Verify Email
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between">
            <Link to="/signup">
              <p className="text-richblack-5 flex items-center gap-x-2">
                <BiArrowBack /> Back To Signup
              </p>
            </Link>
            <button
              className="flex items-center text-blue-100 gap-x-2"
              onClick={() => sendOtp(signupData.email)}
            >
              <RxCountdownTimer />
              Resend it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyEmail;