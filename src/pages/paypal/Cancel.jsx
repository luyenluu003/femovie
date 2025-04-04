import React from 'react';
import { Link } from 'react-router-dom';

const Cancel = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-neutral-200">
            <div className="bg-neutral-800 p-8 rounded-lg shadow-lg text-center max-w-md w-full">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Thanh toán đã bị hủy</h2>
                <p className="text-neutral-400 mb-6">
                    Bạn đã hủy thanh toán gói VIP. Nếu muốn thử lại, hãy quay lại trang mua gói.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link
                        to="/vip-purchase"
                        className="px-6 py-2 bg-green-500 text-neutral-900 rounded-full hover:bg-green-600 transition-colors"
                    >
                        Mua gói VIP
                    </Link>
                    <Link
                        to="/"
                        className="px-6 py-2 border border-neutral-600 text-neutral-200 rounded-full hover:bg-neutral-700 transition-colors"
                    >
                        Về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Cancel;