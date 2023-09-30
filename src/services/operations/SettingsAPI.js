import { toast } from "react-hot-toast"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiconnector"
import { settingsEndpoints } from "../apis"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { setToken } from "../../slices/authSlice"

const {
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints


export async function changePassword(token, formData) {
  // Show a loading message
  const toastId = toast.loading("Loading...");

  try {
    // Send a request to the password change API with the user's token for authentication.
    const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
      Authorisation: `Bearer ${token}`,
    });

    // Check if the response indicates success
    if (response.data.success) {
      // If successful, display a success message.
      toast.success("Password Changed Successfully");
    } else {
      // If there's an error, display an error message.
      throw new Error(response.data.message);
    }
  } catch (error) {
    // Handle any errors that occur during the process and show an error message.
    console.log("Password change error:", error);
    toast.error(error.response.data.message);
  }

  // Dismiss the loading message.
  toast.dismiss(toastId);
}

export function deleteProfile(token, navigate) {
  
  return async (dispatch) => {
    
    function logout(navigate){
      dispatch(setToken(null));
      dispatch(setUser(null));
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      toast.success("Logged Out")
      navigate("/")
    }
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorisation: `Bearer ${token}`,
      })
      console.log("DELETE_PROFILE_API API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Profile Deleted Successfully")
      dispatch(logout(navigate))
    } catch (error) {
      console.log("DELETE_PROFILE_API API ERROR............", error)
      toast.error("Could Not Delete Profile")
    }
    toast.dismiss(toastId)
  }
}