import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaKey } from "react-icons/fa";

const ResetPassword = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: Gửi email, 2: Nhập token + mật khẩu
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Gửi yêu cầu lấy token
    const onSendTokenHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const timestamp = Date.now();
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/v1/authen/forgot`,
                null,
                {
                    params: { timestamp, email },
                    headers: { "Accept-language": "vi" },
                }
            );

            const data = response.data;
            console.log("Send Token Response =>>>", data);

            if (data && data.data && data.data.check) {
                toast.success("Token đã được gửi đến email của bạn!");
                setStep(2); // Chuyển sang bước nhập token và mật khẩu
            } else {
                toast.error(data.message || "Gửi token thất bại!");
            }
        } catch (error) {
            console.error("Error caught:", error);
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi!");
        } finally {
            setLoading(false);
        }
    };

    // Đặt lại mật khẩu với token
    const onResetHandler = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
            return;
        }

        setLoading(true);

        try {
            const timestamp = Date.now();
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/v1/authen/reset`,
                null,
                {
                    params: { timestamp, email, password: newPassword, token },
                    headers: { "Accept-language": "vi" },
                }
            );

            const data = response.data;
            console.log("Reset Password Response =>>>", data);

            if (data && data.message === "Reset Password Success") {
                toast.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
                navigate("/login");
            } else {
                toast.error(data.message || "Đặt lại mật khẩu thất bại!");
            }
        } catch (error) {
            console.error("Error caught:", error);
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
            {/* Logo */}
            <img
                onClick={() => navigate("/")}
                src="https://static.vecteezy.com/system/resources/previews/023/552/814/non_2x/anime-minimalist-and-flat-logo-illustration-vector.jpg"
                className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer rounded-full"
                alt="Logo"
            />

            {/* Form Reset Password */}
            <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
                <h2 className="text-3xl font-semibold text-white text-center mb-3">
                    {step === 1 ? "Quên Mật Khẩu" : "Đặt Lại Mật Khẩu"}
                </h2>
                <p className="text-center text-sm mb-6">
                    {step === 1
                        ? "Nhập email để nhận token đặt lại mật khẩu."
                        : "Nhập token và mật khẩu mới để đặt lại."}
                </p>

                {step === 1 ? (
                    <form onSubmit={onSendTokenHandler}>
                        {/* Email */}
                        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                            <FaEnvelope className="text-indigo-300" />
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className="bg-transparent outline-none flex-1 text-indigo-300"
                                type="email"
                                placeholder="Email"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`cursor-pointer w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium ${
                                loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {loading ? "Đang gửi..." : "Gửi Token"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={onResetHandler}>
                        {/* Token */}
                        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                            <FaKey className="text-indigo-300" />
                            <input
                                onChange={(e) => setToken(e.target.value)}
                                value={token}
                                className="bg-transparent outline-none flex-1 text-indigo-300"
                                type="text"
                                placeholder="Token từ email"
                                required
                            />
                        </div>

                        {/* New Password */}
                        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                            <FaLock className="text-indigo-300" />
                            <input
                                onChange={(e) => setNewPassword(e.target.value)}
                                value={newPassword}
                                className="bg-transparent outline-none flex-1 text-indigo-300"
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Mật khẩu mới"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="text-indigo-300 focus:outline-none"
                            >
                                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                            <FaLock className="text-indigo-300" />
                            <input
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                value={confirmPassword}
                                className="bg-transparent outline-none flex-1 text-indigo-300"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Xác nhận mật khẩu"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-indigo-300 focus:outline-none"
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`cursor-pointer w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium ${
                                loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                        </button>
                    </form>
                )}

                {/* Quay lại Login */}
                <p className="text-gray-400 text-center text-xs mt-4">
                    Quay lại{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-blue-400 cursor-pointer underline"
                    >
                        Đăng nhập
                    </span>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;