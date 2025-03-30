import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import RootLayout from "../../layout/RootLayout";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaTrash, FaPlay, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { TbReload } from "react-icons/tb";

const Playlist = () => {
    const { user } = useSelector((state) => state.auth);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1); // Trang hiện tại, bắt đầu từ 1
    const [hasMore, setHasMore] = useState(true); // Kiểm tra còn dữ liệu để load
    const pageSize = 9; // Số phim mỗi trang

    // Fetch danh sách phim yêu thích
    useEffect(() => {
        const fetchFavorites = async () => {
            if (!user?.email) return;

            setLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/v1/favorite/playlistFavorite`, {
                    params: { email: user?.email, page: page, size: pageSize },
                    headers: { "Accept-language": "vi" }
                });
                console.log("Favorites data:", response.data);
                const newFavorites = response.data || [];
                setFavorites(prev => page === 1 ? newFavorites : [...prev, ...newFavorites]);
                setHasMore(newFavorites.length === pageSize); // Còn dữ liệu nếu trả về đủ pageSize
            } catch (error) {
                toast.error("Lỗi khi lấy danh sách yêu thích");
                console.error("Lỗi khi lấy danh sách yêu thích:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) {
            fetchFavorites();
        }
    }, [user?.email, page]); // Thêm page vào dependency

    // Xóa phim khỏi playlist
    const handleRemoveFromPlaylist = async (movieCode) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/v1/favorite/unlikeFavorite`,
                null,
                {
                    params: { email: user.email, movieCode },
                    headers: { "Accept-language": "vi" }
                }
            );
            if (response.status === 200) {
                setFavorites(favorites.filter((movie) => movie.movieCode !== movieCode));
                toast.success("Đã xóa khỏi playlist!");
            }
        } catch (error) {
            toast.error("Lỗi khi xóa khỏi playlist");
            console.error("Lỗi khi xóa:", error);
        }
    };

    // Xử lý load more
    const handleLoadMore = () => {
        setPage(prev => prev + 1);
    };

    return (
        <main className="w-full min-h-screen bg-black text-neutral-300 flex flex-col">
            <Navbar />
            <div className="w-full min-h-screen flex flex-col space-y-16">
                <div className="w-full pt-[10ch] pb-16">
                    <RootLayout className="space-y-12">
                        {/* Header */}
                        <div className="w-full bg-gradient-to-r from-green-900/20 to-black p-8 rounded-xl shadow-2xl border border-neutral-800">
                            <h1 className="text-4xl md:text-5xl font-bold text-neutral-50 tracking-tight">
                                Playlist Yêu Thích
                            </h1>
                            <p className="text-neutral-400 mt-2 text-lg">
                                Tổng cộng {favorites.length} bộ phim / Trang {page}
                            </p>
                        </div>

                        {/* Danh sách phim */}
                        {loading && page === 1 ? (
                            <div className="w-full flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
                            </div>
                        ) : favorites.length > 0 ? (
                            <>
                                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {favorites.map((movie) => (
                                        <div
                                            key={movie.movieCode}
                                            className="group relative bg-neutral-900 rounded-xl overflow-hidden shadow-lg hover:shadow-green-500/20 transition-all duration-300 transform hover:-translate-y-2"
                                        >
                                            {/* Hình ảnh */}
                                            <div className="relative">
                                                <img
                                                    src={movie.imageUrl}
                                                    alt={movie.movieName}
                                                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>

                                            {/* Thông tin */}
                                            <div className="p-5 space-y-3">
                                                <h3 className="text-xl font-semibold text-neutral-50 truncate group-hover:text-green-400 transition-colors">
                                                    {movie.movieName}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-neutral-400">
                                                    <span>{movie.duration}</span>
                                                    <span className="w-1 h-1 bg-neutral-600 rounded-full"></span>
                                                    <span>{new Date(movie.releaseDate).toLocaleDateString("vi-VN")}</span>
                                                </div>
                                                <div className="text-sm text-neutral-500 flex items-center gap-2">
                                                    <FaHeart className="w-4 h-4 text-red-500" />
                                                    <span>Thích vào: {movie.favoriteDate ? new Date(movie.favoriteDate).toLocaleDateString("vi-VN") : "Không rõ"}</span>
                                                </div>
                                            </div>

                                            {/* Nút hành động */}
                                            <div className="absolute bottom-5 right-5 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <Link
                                                    to={`/movie-detail/${movie.movieCode}`}
                                                    className="p-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
                                                >
                                                    <FaPlay className="w-4 h-4 text-white" />
                                                </Link>
                                                <button
                                                    onClick={() => handleRemoveFromPlaylist(movie.movieCode)}
                                                    className="p-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <FaTrash className="w-4 h-4 text-white" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Nút Load More */}
                                {hasMore && (
                                    <div className="w-full flex justify-center mt-8">
                                        <button
                                            onClick={handleLoadMore}
                                            disabled={loading}
                                            className={`flex items-center gap-2 px-6 py-3 rounded-full bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            <TbReload className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                                            {loading ? "Đang tải..." : "Tải thêm"}
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="w-full text-center py-16">
                                <FaHeart className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                                <p className="text-xl text-neutral-400">
                                    Playlist của bạn đang trống. Thêm phim yêu thích ngay nào!
                                </p>
                                <Link
                                    to="/movies"
                                    className="mt-6 inline-block px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                                >
                                    Khám phá phim
                                </Link>
                            </div>
                        )}
                    </RootLayout>
                </div>
            </div>
            <Footer />
        </main>
    );
};

export default Playlist;