import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaPhone, FaEnvelope, FaLock, FaCamera, FaCrown, FaArrowLeft } from 'react-icons/fa';
import { updateUser } from '../../redux/authSlice';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const userId = user?.userId;

    const [formData, setFormData] = useState({
        userName: user?.userName || '',
        phoneNumber: user?.phoneNumber || '',
        avatar: user?.avatar || 'https://anhcute.net/wp-content/uploads/2024/11/anh-anime.jpg',
    });
    const [loading, setLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(formData.avatar);

    const vipLevel = user?.vipLevel || 'Chưa có';
    const vipEndDate = user?.vipEndDate ? new Date(user.vipEndDate).toLocaleDateString() : 'N/A';

    useEffect(() => {
        if (!userId) {
            toast.error('Vui lòng đăng nhập để chỉnh sửa thông tin!');
            navigate('/login');
        }
    }, [userId, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64FullString = reader.result;
                const base64String = base64FullString.split(',')[1];
                setAvatarPreview(base64FullString);
                setFormData((prev) => ({ ...prev, avatar: base64String }));
                console.log("Base64 Thô:", base64String);
            };
            reader.readAsDataURL(file);
            console.log("Selected File:", file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/v1/authen/update`,
                {
                    userId,
                    userName: formData.userName,
                    phoneNumber: formData.phoneNumber,
                    avatar: formData.avatar
                },
                {
                    headers: { 'Accept-language': 'vi' },
                }
            );
    
            if (response.data && response.data.error) {
                throw new Error(response.data.error);
            }
    
            console.log("DỮ LIỆU CẬP NHẬT ==>", response.data);
            const userUpdate = {
                userId: response.data.data.userId || '',
                email: response.data.data.email || '',
                userName: response.data.data.userName || '',
                avatar: response.data.data.avatar || '',
                phoneNumber: response.data.data.phoneNumber || '',
                vipLevel: response.data.data.vipLevel || '',
                vipStartDate: response.data.data.vipStartDate || '',
                vipEndDate: response.data.data.vipEndDate || ''
            };
    
            const updatedUserData = { ...(user || {}), ...userUpdate };
            console.log("Dữ liệu gửi đi:", updatedUserData);
    
            dispatch(updateUser(updatedUserData));
            
            toast.success('Cập nhật thông tin thành công!');
            navigate('/');
        } catch (error) {
            console.error("Phản hồi lỗi:", error.response);
            console.error("Thông báo lỗi:", error.message);
            toast.error(`Lỗi khi cập nhật: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        navigate(-1); // Quay lại trang trước đó
    };

    return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-24">
            <div className="max-w-lg w-full bg-neutral-800 rounded-xl shadow-2xl p-8 transform transition-all duration-300 hover:shadow-green-500/20">
                {/* Nút Quay lại */}
                <button
                    onClick={handleGoBack}
                    className="flex items-center text-neutral-400 hover:text-green-500 mb-6 transition-colors duration-200"
                >
                    <FaArrowLeft className="mr-2" />
                    Quay lại
                </button>

                <h1 className="text-3xl font-bold text-green-500 mb-8 text-center">Hồ sơ cá nhân</h1>

                {/* Avatar */}
                <div className="flex justify-center mb-6 relative group">
                    <div className="relative">
                        <img
                            src={avatarPreview}
                            alt="Avatar"
                            className="w-32 h-32 object-cover rounded-full border-4 border-neutral-700 transition-transform duration-300 group-hover:scale-105"
                        />
                        <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full cursor-pointer">
                            <FaCamera className="text-white w-6 h-6" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </label>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <FaUser className="absolute top-3 left-3 text-neutral-400" />
                        <input
                            type="text"
                            name="userName"
                            value={formData.userName}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-neutral-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:bg-neutral-600"
                            placeholder="Tên người dùng"
                        />
                    </div>

                    <div className="relative">
                        <FaPhone className="absolute top-3 left-3 text-neutral-400" />
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-neutral-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:bg-neutral-600"
                            placeholder="Số điện thoại"
                        />
                    </div>

                    <div className="relative">
                        <FaEnvelope className="absolute top-3 left-3 text-neutral-400" />
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full pl-10 pr-4 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-neutral-400 cursor-not-allowed"
                            placeholder="Email"
                        />
                    </div>

                    {/* Thông tin VIP */}
                    <div className="bg-neutral-700 p-4 rounded-md border border-neutral-600 flex items-center space-x-3">
                        <FaCrown className={`text-${vipLevel !== 'Chưa có' ? 'yellow-500' : 'neutral-400'} w-6 h-6`} />
                        <div>
                            <p className="text-neutral-200 font-medium">
                                {vipLevel === '1' ? 'VIP 1 tháng' : vipLevel === '2' ? 'VIP 3 tháng' : vipLevel === '3' ? 'VIP 1 năm' : 'Chưa có VIP'}
                            </p>
                            <p className="text-neutral-400 text-sm">Kết thúc: {vipEndDate}</p>
                        </div>
                    </div>

                    {/* Nút cập nhật */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full cursor-pointer py-3 rounded-full font-semibold text-neutral-900 transition-all duration-300 ${
                            loading ? 'bg-neutral-600 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 hover:shadow-lg'
                        }`}
                    >
                        {loading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                    </button>
                </form>

                {/* Nút đổi mật khẩu */}
                <button
                    onClick={() => navigate('/change-password')}
                    className="w-full cursor-pointer mt-4 flex items-center justify-center py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-neutral-200 font-semibold transition-all duration-300 hover:shadow-lg"
                >
                    <FaLock className="mr-2" /> Đổi mật khẩu
                </button>
            </div>
        </div>
    );
};

export default Profile;