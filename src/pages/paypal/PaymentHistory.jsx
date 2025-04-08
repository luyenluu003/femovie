import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const PaymentHistory = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [transactions, setTransactions] = useState([]);
    const [searchDate, setSearchDate] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(1);

    // Hàm định dạng ngày giờ
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    // Hàm gọi API
    const fetchTransactions = async (currentPage) => {
        if (!user?.userId) {
            toast.error("Không tìm thấy thông tin người dùng!");
            console.log("User ID is missing!");
            return;
        }

        try {
            console.log("Fetching transactions for page:", currentPage);
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/v1/payment/allTransition/user`,
                {
                    params: {
                        userId: user.userId,
                        page: currentPage,
                        pageSize: pageSize,
                    },
                    headers: { "Accept-language": "vi" },
                }
            );

            if (response.status === 204) {
                console.log("No content returned from API");
                setTransactions([]);
                setTotalPages(1);
            } else {
                console.log("API Response:", response.data);
                setTransactions(response.data);

                // Kiểm tra dữ liệu trả về để tính totalPages
                const totalRecords = response.data.totalRecords || response.data.length;
                console.log("Total Records:", totalRecords);
                const calculatedTotalPages = Math.ceil(totalRecords / pageSize) || 1;
                console.log("Calculated Total Pages:", calculatedTotalPages);
                setTotalPages(calculatedTotalPages);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
            toast.error("Không thể tải lịch sử thanh toán!");
            setTransactions([]);
            setTotalPages(1);
        }
    };

    // Gọi API khi page thay đổi
    useEffect(() => {
        console.log("Current Page:", page);
        console.log("Total Pages:", totalPages);
        fetchTransactions(page);
    }, [page]);

    // Hàm tìm kiếm theo ngày
    const handleSearch = () => {
        if (!searchDate) {
            fetchTransactions(page);
            return;
        }

        const searchTimestamp = new Date(searchDate).setHours(0, 0, 0, 0);
        const filtered = transactions.filter((transaction) => {
            const transactionDay = new Date(transaction.transactionDate).setHours(0, 0, 0, 0);
            return transactionDay === searchTimestamp;
        });
        setTransactions(filtered);
    };

    // Hàm quay lại
    const handleGoBack = () => {
        navigate(-1);
    };

    // Hàm chuyển trang
    const handlePageChange = (newPage) => {
        console.log("Attempting to change to page:", newPage);
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        } else {
            console.log("Page change blocked: newPage out of range");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full bg-neutral-800 rounded-xl shadow-2xl p-8">
                <button
                    onClick={handleGoBack}
                    className="flex items-center text-neutral-400 hover:text-green-500 mb-6 transition-colors duration-200"
                >
                    <FaArrowLeft className="mr-2" />
                    Quay lại
                </button>

                <h1 className="text-3xl font-bold text-green-500 mb-8 text-center">Lịch sử thanh toán</h1>

                <div className="mb-6 flex items-center gap-3">
                    <input
                        type="date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        className="bg-neutral-700 border border-neutral-600 rounded-md text-neutral-200 p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-green-500 text-neutral-900 py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center gap-2"
                    >
                        <FaSearch /> Tìm kiếm
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-neutral-200">
                        <thead>
                            <tr className="bg-neutral-700 text-left">
                                <th className="p-3">Gói</th>
                                <th className="p-3">Số tiền</th>
                                <th className="p-3">Ngày giao dịch</th>
                                <th className="p-3">Phương thức</th>
                                <th className="p-3">Trạng thái</th>
                                <th className="p-3">Mã thanh toán</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map((transaction) => (
                                    <tr
                                        key={transaction.paymentId}
                                        className="border-b border-neutral-600 hover:bg-neutral-700"
                                    >
                                        <td className="p-3">{transaction.packageId}</td>
                                        <td className="p-3">
                                            {transaction.amount} {transaction.currency}
                                        </td>
                                        <td className="p-3">{formatDate(transaction.transactionDate)}</td>
                                        <td className="p-3">{transaction.paymentMethod}</td>
                                        <td className="p-3">
                                            <span
                                                className={`${
                                                    transaction.status === "completed"
                                                        ? "text-green-500"
                                                        : "text-red-500"
                                                }`}
                                            >
                                                {transaction.status}
                                            </span>
                                        </td>
                                        <td className="p-3">{transaction.paymentId}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-3 text-center text-neutral-400">
                                        Không có giao dịch nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex justify-between  items-center text-neutral-200">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="bg-neutral-700 cursor-pointer py-2 px-4 rounded-md hover:bg-neutral-600 disabled:opacity-50"
                    >
                        Trước
                    </button>
                    <span>
                        Trang {page} / {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="bg-neutral-700 cursor-pointer py-2 px-4 rounded-md hover:bg-neutral-600 disabled:opacity-50"
                    >
                        Sau
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentHistory;