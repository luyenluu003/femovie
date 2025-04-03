import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const ChangePassword = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const userId = user?.userId;
    const email = user?.email;

    const [formData, setFormData] = useState({
        oldpass: '',
        newpass: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState({
        oldpass: false,
        newpass: false,
        confirmPassword: false,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId) {
            toast.error('Vui lòng đăng nhập để đổi mật khẩu!');
            navigate('/login');
        }
    }, [userId, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleShowPassword = (field) => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (formData.newpass !== formData.confirmPassword) {
            toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp!');
            return;
        }
    
        setLoading(true);
    
        try {
            const params = new URLSearchParams({
                timestamp: Date.now(),
                email: email, 
                oldpass: formData.oldpass,
                newpass: formData.newpass,
            });
    
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/v1/authen/change-pass?${params.toString()}`,
                null, 
                {
                    headers: { 'Accept-language': 'vi' },
                }
            );
    
            if (response.data && response.data.error) {
                throw new Error(response.data.error);
            }
    
            console.log("Đổi mật khẩu thành công:", response.data);
            toast.success('Đổi mật khẩu thành công!');
            navigate('/profile');
        } catch (error) {
            console.error("Phản hồi lỗi:", error.response);
            console.error("Thông báo lỗi:", error.message);
            toast.error(`Lỗi khi đổi mật khẩu: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-24">
            <div className="max-w-lg w-full bg-neutral-800 rounded-xl shadow-2xl p-8 transform transition-all duration-300 hover:shadow-green-500/20">
                <h1 className="text-3xl font-bold text-green-500 mb-8 text-center">Đổi Mật Khẩu</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <FaLock className="absolute top-3 left-3 text-neutral-400" />
                        <input
                            type={showPasswords.oldpass ? 'text' : 'password'}
                            name="oldpass"
                            value={formData.oldpass}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-10 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-neutral-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:bg-neutral-600"
                            placeholder="Mật khẩu cũ"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => toggleShowPassword('oldpass')}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                        >
                            {showPasswords.oldpass ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {/* Mật khẩu mới */}
                    <div className="relative">
                        <FaLock className="absolute top-3 left-3 text-neutral-400" />
                        <input
                            type={showPasswords.newpass ? 'text' : 'password'}
                            name="newpass"
                            value={formData.newpass}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-10 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-neutral-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:bg-neutral-600"
                            placeholder="Mật khẩu mới"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => toggleShowPassword('newpass')}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                        >
                            {showPasswords.newpass ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {/* Xác nhận mật khẩu mới */}
                    <div className="relative">
                        <FaLock className="absolute top-3 left-3 text-neutral-400" />
                        <input
                            type={showPasswords.confirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-10 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-neutral-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:bg-neutral-600"
                            placeholder="Xác nhận mật khẩu mới"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => toggleShowPassword('confirmPassword')}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                        >
                            {showPasswords.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {/* Nút gửi */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full cursor-pointer py-3 rounded-full font-semibold text-neutral-900 transition-all duration-300 ${
                            loading ? 'bg-neutral-600 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 hover:shadow-lg'
                        }`}
                    >
                        {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                    </button>
                </form>

                {/* Nút quay lại */}
                <button
                    onClick={() => navigate('/profile')}
                    className="w-full cursor-pointer mt-4 flex items-center justify-center py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-neutral-200 font-semibold transition-all duration-300 hover:shadow-lg"
                >
                    Quay lại hồ sơ
                </button>
            </div>
        </div>
    );
};

export default ChangePassword;