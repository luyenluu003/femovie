import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const TermsOfUse = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-neutral-900 text-neutral-200 flex flex-col">
            {/* Header */}
            <header className="bg-neutral-800 border-b border-neutral-700 py-6">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-green-500">Điều Khoản Sử Dụng</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-neutral-200 hover:text-green-500 transition-colors"
                    >
                        <FaArrowLeft className="mr-2" /> Quay lại
                    </button>
                </div>
            </header>

            {/* Nội dung chính */}
            <main className="container mx-auto px-4 py-12 max-w-4xl flex-1">
                <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 shadow-lg">
                    <h2 className="text-2xl font-semibold text-neutral-50 mb-4">1. Giới thiệu</h2>
                    <p className="mb-4 text-neutral-300">
                        Chào mừng bạn đến với dịch vụ xem phim trực tuyến của chúng tôi. Bằng cách sử dụng dịch vụ, bạn đồng ý tuân thủ các Điều khoản sử dụng này. Điều khoản áp dụng cho việc xem phim, thanh toán gói VIP và mọi hoạt động liên quan.
                    </p>

                    <h2 className="text-2xl font-semibold text-neutral-50 mb-4">2. Quyền và nghĩa vụ khi xem phim</h2>
                    <ul className="list-disc list-inside mb-4 text-neutral-300">
                        <li>Bạn được phép xem phim trong phạm vi gói dịch vụ đã đăng ký (miễn phí hoặc VIP).</li>
                        <li>Không sao chép, tải xuống, hoặc phân phối nội dung phim mà không có sự cho phép từ chúng tôi.</li>
                        <li>Không sử dụng phần mềm hoặc công cụ để vượt qua các giới hạn truy cập nội dung.</li>
                        <li>Đảm bảo thiết bị của bạn đáp ứng yêu cầu kỹ thuật để xem phim mượt mà.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-neutral-50 mb-4">3. Thanh toán và gói VIP</h2>
                    <p className="mb-4 text-neutral-300">
                        Chúng tôi cung cấp các gói VIP (VIP 1, VIP 2, VIP 3) với quyền lợi khác nhau. Khi thanh toán, bạn cần tuân thủ:
                    </p>
                    <ul className="list-disc list-inside mb-4 text-neutral-300">
                        <li>Thanh toán qua các phương thức được hỗ trợ (ví dụ: thẻ tín dụng, ví điện tử).</li>
                        <li>Gói VIP có hiệu lực từ ngày thanh toán thành công và hết hạn theo thời gian quy định (1 tháng, 3 tháng, 1 năm).</li>
                        <li>Không hoàn tiền sau khi giao dịch hoàn tất, trừ trường hợp lỗi hệ thống từ phía chúng tôi.</li>
                        <li>Chúng tôi có quyền điều chỉnh giá gói VIP mà không cần thông báo trước.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-neutral-50 mb-4">4. Tài khoản và bảo mật</h2>
                    <p className="mb-4 text-neutral-300">
                        Bạn chịu trách nhiệm bảo vệ tài khoản của mình:
                    </p>
                    <ul className="list-disc list-inside mb-4 text-neutral-300">
                        <li>Không chia sẻ thông tin đăng nhập (email, mật khẩu) với người khác.</li>
                        <li>Thông báo ngay cho chúng tôi nếu phát hiện truy cập trái phép qua email <a href="mailto:support@movieapp.com" className="text-green-500 hover:underline">support@movieapp.com</a>.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-neutral-50 mb-4">5. Giới hạn trách nhiệm</h2>
                    <p className="mb-4 text-neutral-300">
                        Chúng tôi không chịu trách nhiệm cho:
                    </p>
                    <ul className="list-disc list-inside mb-4 text-neutral-300">
                        <li>Mất mát dữ liệu hoặc gián đoạn dịch vụ do lỗi mạng hoặc thiết bị của bạn.</li>
                        <li>Thiệt hại phát sinh từ việc sử dụng nội dung phim không đúng mục đích.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-neutral-50 mb-4">6. Thay đổi và chấm dứt dịch vụ</h2>
                    <p className="mb-4 text-neutral-300">
                        Chúng tôi có quyền:
                    </p>
                    <ul className="list-disc list-inside mb-4 text-neutral-300">
                        <li>Cập nhật nội dung phim, gói VIP hoặc điều khoản này bất kỳ lúc nào.</li>
                        <li>Chấm dứt tài khoản của bạn nếu vi phạm điều khoản (ví dụ: sao chép nội dung trái phép).</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-neutral-50 mb-4">7. Liên hệ</h2>
                    <p className="mb-4 text-neutral-300">
                        Nếu bạn có câu hỏi, vui lòng liên hệ qua email: 
                        <a href="mailto:support@movieapp.com" className="text-green-500 hover:underline">support@movieapp.com</a> 
                        hoặc hotline: 0123-456-789.
                    </p>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-neutral-800 border-t border-neutral-700 py-4">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-neutral-400 text-sm">© 2025 MovieApp. Mọi quyền được bảo lưu.</p>
                </div>
            </footer>
        </div>
    );
};

export default TermsOfUse;