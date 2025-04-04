import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCrown, FaSignOutAlt, FaFileAlt, FaUserEdit } from 'react-icons/fa';

const UserMenu = ({ user, onClose, onLogout }) => {
    const navigate = useNavigate();
    
    const [vipLevel, setVipLevel] = useState(Number(user?.vipLevel) || 0);
    const [vipEndDate, setVipEndDate] = useState(user?.vipEndDate ? new Date(user.vipEndDate).toLocaleDateString() : 'Chưa có');

    useEffect(() => {
        setVipLevel(Number(user?.vipLevel) || 0);
        setVipEndDate(user?.vipEndDate ? new Date(user.vipEndDate).toLocaleDateString() : 'Chưa có');
    }, [user]);

    const handleLogout = () => {
        onLogout();
        onClose();
    };

    const vipData = {
        1: { text: 'VIP 1', icon: <FaCrown className="text-yellow-400" />, color: 'bg-yellow-500' },
        2: { text: 'VIP 2', icon: <FaCrown className="text-yellow-500" />, color: 'bg-yellow-600' },
        3: { text: 'VIP 3', icon: <FaCrown className="text-yellow-600" />, color: 'bg-yellow-700' }
    };

    const vipStatus = vipData[vipLevel] || { text: 'Chưa có VIP', icon: null, color: 'bg-gray-500' };

    // Hình ảnh mặc định nếu không có avatar
    const defaultAvatar = 'https://anhcute.net/wp-content/uploads/2024/11/anh-anime.jpg';

    return (
        <div className="absolute top-12 right-0 w-72 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg p-5 z-50 animate-fade-in">
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                        src={user?.avatar || defaultAvatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.src = defaultAvatar)} // Fallback nếu ảnh lỗi
                    />
                </div>
                <div>
                    <p className="text-neutral-50 font-semibold text-lg">{user?.userName || 'User'}</p>
                    <p className="text-neutral-400 text-sm opacity-70">{user?.email || 'example@email.com'}</p>
                </div>
            </div>

            <div className={`flex items-center px-3 py-2 rounded-lg text-white ${vipStatus.color} mb-4`}> 
                {vipStatus.icon && <span className="mr-2">{vipStatus.icon}</span>}
                <p className="text-sm font-medium">
                    {vipStatus.text} {vipStatus.icon && `- Hết hạn: ${vipEndDate}`}
                </p>
            </div>

            <button
                onClick={() => { navigate('/profile'); onClose(); }}
                className="w-full flex items-center px-4 py-3 text-neutral-200 hover:bg-neutral-800 rounded-lg transition-all"
            >
                <FaUserEdit className="mr-3" /> Chỉnh sửa thông tin
            </button>

            <button
                onClick={() => { navigate('/vip-purchase'); onClose(); }}
                className="w-full flex items-center px-4 py-3 text-green-500 hover:bg-green-800 rounded-lg transition-all"
            >
                <FaCrown className="mr-3" /> Mua gói VIP
            </button>

            <button
                onClick={() => { navigate('/terms-of-use'); onClose(); }}
                className="w-full flex items-center px-4 py-3 text-neutral-200 hover:bg-neutral-800 rounded-lg transition-all"
            >
                <FaFileAlt className="mr-3" /> Điều khoản sử dụng
            </button>

            <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-red-500 hover:bg-red-800 rounded-lg transition-all"
            >
                <FaSignOutAlt className="mr-3" /> Đăng xuất
            </button>
        </div>
    );
};

export default UserMenu;