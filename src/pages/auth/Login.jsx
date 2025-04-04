import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/authSlice";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Hàm kiểm tra số điện thoại cơ bản phía client
const isValidPhoneNumber = (phoneNumber) => {
    // Loại bỏ khoảng trắng và kiểm tra định dạng cơ bản
    const cleanedPhone = phoneNumber.replace(/\s/g, "");
    // Kiểm tra xem có bắt đầu bằng +84 và chỉ chứa số
    const phoneRegex = /^\+84\d{9}$/;
    return phoneRegex.test(cleanedPhone);
};

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [state, setState] = useState("Sign Up"); // "Sign Up" là login, "Login" là register
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("+84"); // Mặc định bắt đầu bằng +84
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [phoneError, setPhoneError] = useState(""); // Lưu lỗi số điện thoại

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        // Kiểm tra số điện thoại trước khi gửi
        if (state !== "Sign Up" && !isValidPhoneNumber(phoneNumber)) {
            setPhoneError("Số điện thoại không hợp lệ. Vui lòng nhập số bắt đầu bằng +84 và có 10 chữ số.");
            return;
        }

        try {
            axios.defaults.withCredentials = true;
            let response;

            if (state !== "Sign Up") {
                // Đăng ký (Register)
                const timestamp = Date.now();
                console.log("timestamp:", timestamp);

                response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/v1/authen/regis`,
                    null,
                    {
                        params: { timestamp, username, email, phoneNumber, password },
                        headers: { "Accept-language": "vi" },
                    }
                );

                const data = response.data;
                console.log("DATA REGISTER =>>>", data);

                if (data && (data.message === "Registration Success" || data.data === true)) {
                    toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
                    setState("Sign Up");
                    setUsername("");
                    setEmail("");
                    setPhoneNumber("+84"); // Reset về +84
                    setPassword("");
                    setPhoneError(""); // Xóa lỗi nếu có
                    navigate("/login");
                } else {
                    throw new Error(data.message || "Đăng ký thất bại!");
                }
            } else {
                // Đăng nhập (Login)
                response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/v1/authen/login/email`,
                    null,
                    {
                        params: { email, password },
                        headers: { "Accept-language": "vi" },
                    }
                );

                const data = response.data;
                console.log("DATA LOGIN =>>>", data);

                if (data && data.data) {
                    const token = data.data.token;
                    const user = {
                        userId: data.data.userId,
                        email: data.data.email,
                        userName: data.data.userName,
                        avatar: data.data.avatar,
                        phoneNumber: data.data.phoneNumber,
                        vipLevel: data.data.vipLevel,
                        vipStartDate: data.data.vipStartDate,
                        vipEndDate: data.data.vipEndDate,
                    };

                    dispatch(loginSuccess({ user, token }));
                    toast.success("Đăng nhập thành công!");
                    navigate("/");
                } else {
                    throw new Error(data.message || "Đăng nhập thất bại!");
                }
            }
        } catch (error) {
            console.error("Error caught:", error);
            toast.error(error.response?.data?.message || error.message || "Đã xảy ra lỗi!");
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        // Chỉ cho phép nhập +84 ở đầu và các số sau đó
        if (value.startsWith("+84") && /^\+84\d{0,9}$/.test(value)) {
            setPhoneNumber(value);
            setPhoneError("");
        } else if (value === "+84") {
            setPhoneNumber(value);
            setPhoneError("");
        } else {
            setPhoneError("Số điện thoại phải bắt đầu bằng +84 và chỉ chứa số.");
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/v1/authen/google`,
                { credential: credentialResponse.credential },
                { headers: { "Accept-language": "vi" } }
            );
            console.log("res==>", response.data);
            const token = response.data.data.token;
            const user = {
                userId: response.data.data.userId,
                email: response.data.data.email,
                userName: response.data.data.userName,
                avatar: response.data.data.avatar,
                phoneNumber: response.data.data.phoneNumber,
                vipLevel: response.data.data.vipLevel,
                vipStartDate: response.data.data.vipStartDate,
                vipEndDate: response.data.data.vipEndDate,
            };

            dispatch(loginSuccess({ user, token }));
            toast.success("Đăng nhập bằng Google thành công!");
            navigate("/");
        } catch (error) {
            toast.error("Lỗi khi đăng nhập bằng Google");
            console.error("Google login error:", error);
        }
    };

    const handleGoogleError = () => {
        toast.error("Đăng nhập bằng Google thất bại");
        console.log("Google Login Failed");
    };

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
                <img
                    onClick={() => navigate("/")}
                    src="https://static.vecteezy.com/system/resources/previews/023/552/814/non_2x/anime-minimalist-and-flat-logo-illustration-vector.jpg"
                    className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer rounded-full"
                    alt=""
                />
                <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
                    <h2 className="text-3xl font-semibold text-white text-center mb-3">
                        {state !== "Sign Up" ? "Create account" : "Login"}
                    </h2>
                    <p className="text-center text-sm mb-6">
                        {state !== "Sign Up" ? "Create your account" : "Login to your account!"}
                    </p>

                    <form onSubmit={onSubmitHandler}>
                        {state !== "Sign Up" && (
                            <>
                                <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                                    <img src={assets.person_icon} alt="" />
                                    <input
                                        onChange={(e) => setUsername(e.target.value)}
                                        value={username}
                                        className="bg-transparent outline-none flex-1"
                                        type="text"
                                        placeholder="Full Name"
                                        required
                                    />
                                </div>
                                <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                                    <img src={assets.person_icon} alt="" />
                                    <input
                                        onChange={handlePhoneChange}
                                        value={phoneNumber}
                                        className={`bg-transparent outline-none flex-1 ${phoneError ? "text-red-400" : ""}`}
                                        type="text"
                                        placeholder="+84xxxxxxxxx"
                                        required
                                        maxLength={12} // +84 và 9 số
                                    />
                                </div>
                                {phoneError && (
                                    <p className="text-red-400 text-xs mt-1">{phoneError}</p>
                                )}
                            </>
                        )}

                        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                            <img src={assets.mail_icon} alt="" />
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className="bg-transparent outline-none flex-1"
                                type="email"
                                placeholder="Email"
                                required
                            />
                        </div>

                        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                            <img src={assets.lock_icon} alt="" />
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                className="bg-transparent outline-none flex-1"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-indigo-300 focus:outline-none"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        <p
                            onClick={() => navigate("/resetpassword")}
                            className="mb-4 text-indigo-500 cursor-pointer"
                        >
                            Forgot Password?
                        </p>

                        {state !== "Sign Up" ? (
                            <button className="cursor-pointer w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
                                Sign Up
                            </button>
                        ) : (
                            <button className="cursor-pointer w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
                                Login
                            </button>
                        )}
                    </form>

                    <div className="mt-6 flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            buttonText="Đăng nhập bằng Google"
                            width="300"
                        />
                    </div>

                    {state !== "Sign Up" ? (
                        <p className="text-gray-400 text-center text-xs mt-4">
                            Already have an account?{" "}
                            <span
                                onClick={() => setState("Sign Up")}
                                className="text-blue-400 cursor-pointer underline"
                            >
                                Login here
                            </span>
                        </p>
                    ) : (
                        <p className="text-gray-400 text-center text-xs mt-4">
                            Don't have an account?{" "}
                            <span
                                onClick={() => setState("Login")}
                                className="text-blue-400 cursor-pointer underline"
                            >
                                Sign up
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default Login;