import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate để quay lại
import { FaArrowLeft, FaCrown } from 'react-icons/fa'; // Thêm icon

const VipPackage = () => {
    const { user } = useSelector((state) => state.auth);
    const userId = user?.userId;
    const navigate = useNavigate(); // Hook để điều hướng
    const [vipStatus, setVipStatus] = useState(null);
    const [showPackages, setShowPackages] = useState(false);

    const packages = [
        { id: 'VIP_1M', name: 'Gói 1 tháng', price: 10.0, duration: '30 ngày', benefits: 'Truy cập phim VIP trong 1 tháng' },
        { id: 'VIP_3M', name: 'Gói 3 tháng', price: 25.0, duration: '90 ngày', benefits: 'Truy cập phim VIP + Ưu đãi 15%' },
        { id: 'VIP_YEAR', name: 'Gói 1 năm', price: 100.0, duration: '365 ngày', benefits: 'Truy cập toàn bộ phim VIP + Ưu đãi 20%' },
    ];

    useEffect(() => {
        const checkVipStatus = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/v1/payment/check-vip`, {
                    params: { userId: user?.userId },
                    headers: { "Accept-language": "vi" },
                });
                setVipStatus(response.data);
                if (response.data.includes("Bạn đã có gói VIP còn hạn đến")) {
                    setShowPackages(false);
                } else {
                    setShowPackages(true);
                }
            } catch (error) {
                console.error('Error checking VIP status:', error.response?.data || error.message);
                toast.error('Không thể kiểm tra trạng thái VIP!');
                setShowPackages(true);
            }
        };

        if (userId) {
            checkVipStatus();
        } else {
            setVipStatus('Bạn cần đăng nhập để kiểm tra trạng thái VIP!');
            setShowPackages(false);
        }
    }, [userId]);

    const createOrder = async (total, packageId) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/v1/payment/create`,
                null,
                {
                    params: { total, userId, packageId },
                    headers: { 'Accept-language': 'vi' },
                }
            );
            window.location.href = response.data;
        } catch (error) {
            console.error('Error creating payment:', error.response?.data || error.message);
            toast.error('Lỗi khi tạo thanh toán!');
        }
    };

    const handleShowPackages = () => {
        setShowPackages(true);
    };

    const handleGoBack = () => {
        navigate(-1); // Quay lại trang trước đó
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-neutral-200 py-12 px-4 sm:px-6 lg:px-24 flex flex-col">
            {/* Nút quay lại */}
            <button
                onClick={handleGoBack}
                className="flex items-center gap-2 text-neutral-400 hover:text-neutral-50 transition-colors mb-6"
            >
                <FaArrowLeft className="w-5 h-5" />
                <span>Quay lại</span>
            </button>

            {/* Tiêu đề */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-green-500 flex items-center justify-center gap-2 animate-fadeIn">
                    <FaCrown className="text-yellow-500" /> Mua gói VIP
                </h1>
                <p className="text-neutral-400 mt-2 text-lg">
                    Trải nghiệm không giới hạn với các bộ phim độc quyền cùng chất lượng tuyệt vời!
                </p>
            </div>

            {/* Nội dung chính */}
            <div className="max-w-5xl mx-auto">
                {vipStatus && !showPackages ? (
                    <div className="text-center bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-700 animate-slideUp">
                        <p className="text-neutral-200 text-lg mb-4">{vipStatus}</p>
                        <button
                            onClick={handleShowPackages}
                            className="px-6 py-2 bg-green-500 text-neutral-900 font-semibold rounded-full hover:bg-green-600 transition-colors shadow-md"
                        >
                            Mua gói khác để gia hạn
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {packages.map((pkg) => (
                            <div
                                key={pkg.id}
                                className="bg-neutral-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-700 hover:border-green-500 transform hover:-translate-y-2 animate-fadeIn"
                            >
                                <h2 className="text-2xl font-semibold text-neutral-50 mb-3">{pkg.name}</h2>
                                <p className="text-neutral-400 mb-2">Thời gian: {pkg.duration}</p>
                                <p className="text-neutral-400 mb-4">Ưu đãi: {pkg.benefits}</p>
                                <p className="text-3xl font-bold text-green-500 mb-6">${pkg.price.toFixed(2)}</p>

                                <PayPalScriptProvider
                                    options={{
                                        'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID,
                                        currency: 'USD',
                                    }}
                                >
                                    <PayPalButtons
                                        createOrder={(data, actions) => createOrder(pkg.price, pkg.id)}
                                        className="w-full"
                                    />
                                </PayPalScriptProvider>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* CSS Animation */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-in-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default VipPackage;