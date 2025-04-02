import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';
import { toast } from 'react-toastify';

const VipPackage = () => {
    const { user } = useSelector((state) => state.auth);
    const userId = user?.userId;
    const [vipStatus, setVipStatus] = useState(null); // Trạng thái VIP từ API
    const [showPackages, setShowPackages] = useState(false); // Điều khiển hiển thị gói

    const packages = [
        { id: 'VIP_1M', name: 'Gói 1 tháng', price: 10.0, duration: '30 ngày' },
        { id: 'VIP_3M', name: 'Gói 3 tháng', price: 25.0, duration: '90 ngày' },
        { id: 'VIP_YEAR', name: 'Gói 1 năm', price: 100.0, duration: '365 ngày' },
    ];

    // Gọi API check-vip khi component mount
    useEffect(() => {
        const checkVipStatus = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/v1/payment/check-vip`, {
                    params: { userId: user?.userId},
                    headers: { "Accept-language": "vi" },
                });
                setVipStatus(response.data);
                // Nếu VIP vẫn còn hạn, không hiển thị gói ngay
                if (response.data.includes("Bạn đã có gói VIP còn hạn đến")) {
                    setShowPackages(false);
                } else {
                    setShowPackages(true);
                }
            } catch (error) {
                console.error('Error checking VIP status:', error.response?.data || error.message);
                toast.error('Không thể kiểm tra trạng thái VIP!');
                setShowPackages(true); // Mặc định hiển thị gói nếu lỗi
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

    return (
        <div className="min-h-screen bg-neutral-900 text-neutral-200 py-12 px-4 sm:px-6 lg:px-24">
            <h1 className="text-3xl font-bold text-green-500 text-center mb-8">Mua gói VIP</h1>
            <p className="text-neutral-400 text-center mb-12">
                Nâng cấp tài khoản của bạn để tận hưởng các bộ phim độc quyền và trải nghiệm tuyệt vời!
            </p>

            {vipStatus && !showPackages ? (
                <div className="text-center">
                    <p className="text-neutral-400 mb-6">{vipStatus}</p>
                    <button
                        onClick={handleShowPackages}
                        className="px-6 py-2 bg-green-500 text-neutral-900 rounded-full hover:bg-green-600 transition-colors"
                    >
                        Mua gói khác để gia hạn
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {packages.map((pkg) => (
                        <div
                            key={pkg.id}
                            className="bg-neutral-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-neutral-700"
                        >
                            <h2 className="text-xl font-semibold text-neutral-50 mb-2">{pkg.name}</h2>
                            <p className="text-neutral-400 mb-4">Thời gian: {pkg.duration}</p>
                            <p className="text-2xl font-bold text-green-500 mb-6">${pkg.price.toFixed(2)}</p>

                            <PayPalScriptProvider
                                options={{
                                    'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID,
                                    currency: 'USD',
                                }}
                            >
                                <PayPalButtons
                                    createOrder={(data, actions) => createOrder(pkg.price, pkg.id)}
                                />
                            </PayPalScriptProvider>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VipPackage;