import { useState } from "react"
import { toast } from "react-hot-toast"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import {endpoints} from "../../../services/apis"
import { setLoading, setToken } from "../../../slices/authSlice"
import { setUser } from "../../../slices/profileSlice"
import { apiConnector } from "../../../services/apiconnector"

const {
    LOGIN_API
}=endpoints;


function LoginForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)

  const { email, password } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }


async function login(email, password, navigate) {
        //   Show loading toast
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true))
    try {
  
      // Send a request to the login API
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });
  
      console.log("LOGIN API RESPONSE............", response)
      // Check if the response indicates success
      if (response.data.success) {
        // Successful login
       
        const { token, user } = response.data;
        dispatch(setToken(token));
        const userImage = user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName} ${user.lastName}`;
        dispatch(setUser({ ...response.data.user, image: userImage }))
        // Store the token and user data in local storage
        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("user", JSON.stringify(user));
  
        // Navigate to the dashboard
        navigate("/dashboard/my-profile");
  
        // Show success toast
        toast.success("Login Successful");
      } else {
        // Login failed, show error toast
        toast.error(response.data.message || "Login Failed");
      }
    } catch (error) {
      console.error("LOGIN API ERROR:", error);
      // Show error toast
      toast.error("Login Failed");
    } finally {
      // Hide loading toast
      dispatch(setLoading(false))
      toast.dismiss(toastId);
    }
  }
  
  
  const handleOnSubmit = (e) => {
    e.preventDefault()
    // dispatch(login(email, password, navigate))
    login(email, password, navigate);
  }

  return (
    <form
      onSubmit={handleOnSubmit}
      className="mt-6 flex w-full flex-col gap-y-4"
    >
      <label className="w-full">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Email Address <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type="text"
          name="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Enter email address"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
        />
      </label>
      <label className="relative">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Password <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={handleOnChange}
          placeholder="Enter Password"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-richblack-5"
        />
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[38px] z-[10] cursor-pointer"
        >
          {showPassword ? (
            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
          ) : (
            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
          )}
        </span>
        <Link to="/forgot-password">
          <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">
            Forgot Password
          </p>
        </Link>
      </label>
      <button
        type="submit"
        className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
      >
        Sign In
      </button>
    </form>
  )
}

export default LoginForm