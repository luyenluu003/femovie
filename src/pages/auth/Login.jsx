import React, { useContext, useState } from "react";

import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/authSlice";

const Login = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [state, setState] = useState("Sign Up");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        

        try {
            axios.defaults.withCredentials = true;
            let response;

            if (state !== "Sign Up") {
                const timestamp = Date.now(); // Lấy timestamp hiện tại
                console.log("timestamp:", timestamp)

                response = await axios.post(import.meta.env.VITE_BACKEND_URL + 
                    "/v1/authen/regis",
                    null,
                    {
                        params : {timestamp, username, email, phoneNumber, password},
                        headers: {
                            "Accept-language": "vi",
                        },
                    }
                );
            } else {
                response = await axios.post( import.meta.env.VITE_BACKEND_URL +
                    "/v1/authen/login/email",
                    null,
                    {
                        params: { email, password },
                        headers: {
                            "Accept-language": "vi",
                        },
                    }
                );
            }

            const data = response.data;
            console.log("DATA =>>>", data);

            // Kiểm tra dữ liệu và trả về token
            if (data && data.data) {
                const token = data.data.token;
                const user = {
                    userId: data.data.userId,
                    email: data.data.email,
                    userName: data.data.userName,
                    avatar: data.data.avatar,
                    phoneNumber: data.data.phoneNumber,
                };

                dispatch(loginSuccess({ user, token }));

                if (state !== "Sign Up") {
                    naviage('/login')
                }else{
                    navigate("/")
                }
            } else {
                toast.error(data.message || "Login failed!");
            }
        } catch (error) {
            // Debug: log chi tiết lỗi
            console.error("Error caught:", error);
            toast.error(error.response?.data?.message || "Something went wrong!");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
            <img
                onClick={() => navigate("/")}
                src="https://static.vecteezy.com/system/resources/previews/023/552/814/non_2x/anime-minimalist-and-flat-logo-illustration-vector.jpg"
                className="absolute left-5 
            sm:left-20 top-5 w-28 sm:w-32 cursor-pointer rounded-full"
                alt=""
            />
            <div className="bg-slate-900 p-10 rounded-lg shadow-ld w-full sm:w-96 text-indigo-300 text-sm">
                <h2 className="text-3xl font-semibold text-white text-center mb-3">
                    {state !== "Sign Up" ? "Create account" : "Login"}
                </h2>
                <p className="text-center text-sm mb-6">
                    {state !== "Sign Up"
                        ? "Create your account"
                        : "Login to your account!"}
                </p>

                <form onSubmit={onSubmitHandler}>
                    {state !== "Sign Up" && (
                        <>
                            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                                <img src={assets.person_icon} alt="" />
                                <input
                                    onChange={(e) => setUsername(e.target.value)}
                                    value={username}
                                    className="bg-transparent outline-none"
                                    type="text"
                                    placeholder="Full Name"
                                    required
                                />
                            </div>
                            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                                <img src={assets.person_icon} alt="" />
                                <input
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    value={phoneNumber}
                                    className="bg-transparent outline-none"
                                    type="text"
                                    placeholder="Phone Number"
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                        <img src={assets.mail_icon} alt="" />
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            className="bg-transparent outline-none"
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
                            className="bg-transparent outline-none"
                            type="password"
                            placeholder="Password"
                            required
                        />
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
    );
};

export default Login;
