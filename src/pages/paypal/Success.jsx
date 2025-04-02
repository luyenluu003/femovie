import React, { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Success = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [message, setMessage] = useState('Đang xử lý thanh toán...');
    const [isProcessed, setIsProcessed] = useState(false);
    const hasRun = useRef(false);

    // Hàm tính vipEndDate dựa trên packageId
    const calculateVipEndDate = (packageId) => {
        const currentDate = new Date();
        let daysToAdd;

        switch (packageId) {
            case 'VIP_1M':
                daysToAdd = 30;
                break;
            case 'VIP_3M':
                daysToAdd = 90;
                break;
            case 'VIP_YEAR':
                daysToAdd = 365;
                break;
            default:
                daysToAdd = 0;
        }

        currentDate.setDate(currentDate.getDate() + daysToAdd);
        return currentDate.getTime();
        
    };

    // Hàm xử lý thanh toán
    const completePayment = async (paymentId, payerId, userId, packageId) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/v1/payment/success`, {
                params: { paymentId, PayerID: payerId, userId, packageId },
            });
            console.log("CHECK"); // Log để kiểm tra
            setMessage(response.data);

            if (response.data.includes("Thanh toán thành công")) {
                toast.success(response.data);

                // Xác định vipLevel dựa trên packageId
                const vipLevelMap = {
                    'VIP_1M': 1,
                    'VIP_3M': 2,
                    'VIP_YEAR': 3,
                };
                const vipLevel = vipLevelMap[packageId] || 0;

                // Tính vipEndDate
                const vipEndDate = calculateVipEndDate(packageId);
                
                const startTimestamp = () => {
                    return Date.now(); // Trả về timestamp (milliseconds)
                };
                
                // Ví dụ sử dụng
                const vipStartDate = startTimestamp();

                // Lưu vào localStorage
                const userData = JSON.parse(localStorage.getItem('user')) || {};
                const updatedUserData = {
                    ...userData,
                    vipLevel,
                    vipStartDate,
                    vipEndDate,
                };
                localStorage.setItem('user', JSON.stringify(updatedUserData));
                localStorage.setItem(`payment_${paymentId}`, 'processed');
            } else if (response.data.includes("đã được thực hiện trước đó")) {
                toast.info(response.data);
            } else {
                toast.error(response.data);
            }
            setIsProcessed(true);
        } catch (error) {
            const errorMessage = error.response?.data || error.message;
            setMessage(errorMessage);
            toast.error(errorMessage);
            setIsProcessed(true);
        }
    };

    const params = new URLSearchParams(location.search);
    const paymentId = params.get('paymentId');
    const payerId = params.get('PayerID');
    const userId = params.get('userId');
    const packageId = params.get('packageId');

    if (!hasRun.current) {
        if (paymentId && payerId && userId && packageId && !isProcessed) {
            const isProcessedBefore = localStorage.getItem(`payment_${paymentId}`);
            if (!isProcessedBefore) {
                completePayment(paymentId, payerId, userId, packageId);
            } else {
                setMessage("Thanh toán đã được thực hiện trước đó!");
                toast.info("Thanh toán đã được thực hiện trước đó!");
                setIsProcessed(true);
            }
        } else if (!isProcessed) {
            setMessage('Thiếu thông tin thanh toán');
            toast.error('Thiếu thông tin thanh toán');
            navigate('/vip');
        }
        hasRun.current = true;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-neutral-200">
            <div className="bg-neutral-800 p-8 rounded-lg shadow-lg text-center max-w-md w-full">
                {isProcessed && message.includes("Thanh toán thành công") ? (
                    <>
                        <h2 className="text-2xl font-bold text-green-500 mb-4">Thanh toán thành công!</h2>
                        <p className="text-neutral-400 mb-6">
                            Gói VIP của bạn đã được gia hạn. Hãy tận hưởng trải nghiệm xem phim tuyệt vời!
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                to="/"
                                className="px-6 py-2 bg-green-500 text-neutral-900 rounded-full hover:bg-green-600 transition-colors"
                            >
                                Về trang chủ
                            </Link>
                            <Link
                                to="/profile"
                                className="px-6 py-2 border border-neutral-600 text-neutral-200 rounded-full hover:bg-neutral-700 transition-colors"
                            >
                                Xem tài khoản
                            </Link>
                        </div>
                    </>
                ) : (
                    <p className="text-neutral-400">{message}</p>
                )}
            </div>
        </div>
    );
};

export default Success;