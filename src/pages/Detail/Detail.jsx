import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import RootLayout from "../../layout/RootLayout";
import { FaPlay, FaStar, FaHeart } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { MdHd } from "react-icons/md";
import RelatedMovie from "../../components/relatedMovie/RelatedMovie";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import ActorList from "../../components/actor/ActorList";
import Comment from "../../components/comment/Comment";

const Detail = () => {
    const { movieCode } = useParams();
    const { user } = useSelector((state) => state.auth);
    const [movie, setMovie] = useState({});
    const [isLiked, setIsLiked] = useState(false);
    const [userRating, setUserRating] = useState(0); // Đánh giá của người dùng hiện tại
    const [averageRating, setAverageRating] = useState({ averageRating: 0, totalRatings: 0 }); // Trung bình đánh giá từ API

    // Lấy thông tin phim
    useEffect(() => {
        const fetchMovieByMovieCode = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/v1/movie/detailMovie`, {
                    params: { userId: user?.userId, movieCode },
                    headers: { "Accept-language": "vi" },
                });
                setMovie(response.data?.data || {});
            } catch (error) {
                toast.error("Lỗi khi lấy thông tin phim");
                console.error("Lỗi khi lấy thông tin phim:", error);
            }
        };

        if (movieCode) {
            fetchMovieByMovieCode();
        }
    }, [movieCode, user?.userId]);

    // Kiểm tra trạng thái yêu thích
    useEffect(() => {
        const checkFavorite = async () => {
            if (!user?.email || !movieCode) return;

            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/v1/favorite/checkFavorite`, {
                    params: { email: user?.email, movieCode },
                    headers: { "Accept-language": "vi" },
                });
                setIsLiked(response.data?.data.active || false);
            } catch (error) {
                console.error("Lỗi khi kiểm tra favorite:", error);
            }
        };

        if (user?.email && movieCode) {
            checkFavorite();
        }
    }, [user?.email, movieCode]);

    // Lấy trung bình đánh giá của phim
    useEffect(() => {
        const fetchAverageRating = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/v1/rating/average`, {
                    params: { movieCode },
                    headers: { "Accept-language": "vi" },
                });
                setAverageRating(response.data || { averageRating: 0, totalRatings: 0 });
            } catch (error) {
                console.error("Lỗi khi lấy trung bình đánh giá:", error);
            }
        };

        if (movieCode) {
            fetchAverageRating();
        }
    }, [movieCode]);

    // Lấy đánh giá của người dùng hiện tại và reset khi movieCode thay đổi
    useEffect(() => {
        // Reset userRating khi movieCode thay đổi
        setUserRating(0);

        const fetchUserRating = async () => {
            if (!user?.userId || !movieCode) return;

            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/v1/rating/getRating`, {
                    params: { userId: user?.userId, movieCode },
                    headers: { "Accept-language": "vi" },
                });
                if (response.data) {
                    setUserRating(response.data.rating || 0);
                }
            } catch (error) {
                // Nếu không có đánh giá (HTTP 204), giữ userRating = 0
                if (error.response?.status !== 204) {
                    console.error("Lỗi khi lấy đánh giá của người dùng:", error);
                }
            }
        };

        if (user?.userId && movieCode) {
            fetchUserRating();
        }
    }, [user?.userId, movieCode]);

    // Xử lý toggle yêu thích
    const handleToggleFavorite = async () => {
        if (!user?.email) {
            toast.error("Vui lòng đăng nhập để thích phim");
            return;
        }

        try {
            if (isLiked) {
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/v1/favorite/unlikeFavorite`,
                    null,
                    { params: { email: user?.email, movieCode }, headers: { "Accept-language": "vi" } }
                );
                if (response.status === 200) {
                    setIsLiked(false);
                    toast.success("Đã xóa khỏi danh sách yêu thích!");
                }
            } else {
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/v1/favorite/likeFavorite`,
                    null,
                    { params: { email: user?.email, movieCode }, headers: { "Accept-language": "vi" } }
                );
                if (response.status === 200 || response.status === 201) {
                    setIsLiked(true);
                    toast.success("Đã thêm vào danh sách yêu thích!");
                }
            }
        } catch (error) {
            toast.error(`Lỗi khi ${isLiked ? "xóa khỏi" : "thêm vào"} danh sách yêu thích`);
            console.error("Lỗi khi toggle favorite:", error);
        }
    };

    // Xử lý gửi đánh giá
    const handleRatingSubmit = async (rating) => {
        if (!user?.userId) {
            toast.error("Vui lòng đăng nhập để đánh giá phim");
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/v1/rating/submit`,
                null,
                {
                    params: { userId: user?.userId, movieCode, rating },
                    headers: { "Accept-language": "vi" },
                }
            );
            if (response.status === 200 || response.status === 201) {
                setUserRating(rating);
                toast.success("Đánh giá của bạn đã được gửi!");
                // Cập nhật lại trung bình đánh giá
                const avgResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/v1/rating/average`, {
                    params: { movieCode },
                    headers: { "Accept-language": "vi" },
                });
                setAverageRating(avgResponse.data || { averageRating: 0, totalRatings: 0 });
            }
        } catch (error) {
            toast.error("Lỗi khi gửi đánh giá");
            console.error("Lỗi khi gửi đánh giá:", error);
        }
    };

    return (
        <main className="w-full min-h-screen bg-black text-neutral-500 flex flex-col">
            <Navbar />
            <div className="w-full min-h-screen space-y-16 flex flex-col">
                <div className="w-full pt-[10ch] pb-16">
                    <RootLayout className="space-y-16">
                        <div className="w-full grid md:grid-cols-5 grid-cols-2 md:gap-16 gap-8 items-center">
                            <div className="md:col-span-2 col-span-5 space-y-2">
                                {movie && movie.imageUrl ? (
                                    <img
                                        src={movie.imageUrl}
                                        alt={movie.movieName}
                                        className="md:w-[90%] w-full aspect-[9/13] object-cover object-center rounded-xl"
                                    />
                                ) : (
                                    <div className="w-full h-[300px] flex items-center justify-center bg-gray-200 rounded-xl">
                                        <p className="text-gray-500">Đang tải ảnh...</p>
                                    </div>
                                )}
                            </div>
                            <div className="md:col-span-3 col-span-5 space-y-7">
                                <div className="space-y-1.5">
                                    <div className="w-full flex items-center justify-between gap-1.5">
                                        <h1 className="md:text-4xl text-3xl text-neutral-50 font-bold">
                                            {movie.movieName}
                                        </h1>
                                        <div className="flex items-center gap-x-2">
                                            <p className="text-base md:text-lg text-neutral-50 font-semibold">
                                                {averageRating.averageRating.toFixed(1)}
                                            </p>
                                            <div className="flex items-center">
                                                <FaStar className="w-4 h-4 text-yellow-500" />
                                            </div>
                                            <p className="text-sm text-neutral-400">
                                                ({averageRating.totalRatings} đánh giá)
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-x-2 text-sm text-neutral-500 font-normal">
                                        <p>{new Date(movie.releaseDate).toLocaleDateString("vi-VN")}</p>
                                        <div className="w-1 h-1 bg-neutral-600 rounded-full" />
                                        {movie.type ? (
                                            movie.episodes?.length > 0 && <p>{movie.episodes.length} tập</p>
                                        ) : (
                                            movie.duration && <p>{movie.duration} phút</p>
                                        )}
                                        <div className="w-1 h-1 bg-neutral-600 rounded-full" />
                                        <p>{movie.censorship}+</p>
                                        <div className="w-1 h-1 bg-neutral-600 rounded-full" />
                                        <p className="text-yellow-500">
                                            <MdHd className="w-5 h-5" />
                                        </p>
                                    </div>
                                </div>

                                <p className="md:text-base text-sm font-normal text-neutral-400">
                                    {movie.description}
                                </p>

                                <div className="w-full flex items-start gap-x-4">
                                    <p className="text-base text-neutral-500 font-medium">Genres:</p>
                                    <div className="flex items-center gap-x-1.5 flex-wrap text-sm text-neutral-400 font-normal">
                                        {movie.movieGenre}
                                    </div>
                                </div>

                                {/* UI đánh giá */}
                                <div className="w-full flex items-center gap-x-4">
                                    <p className="text-base text-neutral-500 font-medium">Đánh giá của bạn:</p>
                                    <div className="flex items-center gap-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                className={`w-5 h-5 cursor-pointer ${
                                                    star <= userRating ? "text-yellow-500" : "text-gray-500"
                                                }`}
                                                onClick={() => handleRatingSubmit(star)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 !mt-10">
                                    <Link
                                        to={`/movie/video-player/${movie.movieCode}`}
                                        state={{ videoUrl: movie.videoUrl }}
                                        className="md:w-fit w-1/2 px-6 md:py-2.5 py-3 rounded-full capitalize bg-green-500 hover:bg-green-500/10 border-2 border-green-500 hover:border-green-500 flex items-center justify-center gap-x-2 text-base text-neutral-50 hover:text-neutral-100 font-normal ease-in-out duration-300 cursor-pointer"
                                    >
                                        <FaPlay />
                                        Play Now
                                    </Link>
                                    <button
                                        onClick={handleToggleFavorite}
                                        className={`md:w-fit w-1/2 px-6 md:py-2.5 py-3 rounded-full capitalize flex items-center justify-center gap-x-2 text-base font-normal ease-in-out duration-300 cursor-pointer ${
                                            isLiked
                                                ? "bg-red-500 hover:bg-red-500/10 border-2 border-red-500 hover:border-red-500 text-neutral-50 hover:text-neutral-100"
                                                : "bg-gray-500/50 border-2 border-gray-500 text-neutral-400"
                                        }`}
                                    >
                                        <FaHeart />
                                        {isLiked ? "Bỏ thích" : "Thích"}
                                    </button>
                                </div>
                                <div className="w-full space-y-3 !mt-14">
                                    <ActorList actors={movie.actors || []} />
                                </div>
                            </div>
                        </div>
                        <div className="w-full space-y-3 !mt-14">
                            <p className="text-base text-neutral-500 font-medium">Related Movies:</p>
                            <RelatedMovie />
                        </div>
                        <div className="w-full space-y-3 !mt-14">
                            <p className="text-base text-neutral-500 font-medium">Comment:</p>
                            <Comment userId = {user?.userId} movieCode = {movieCode} />

                        </div>
                    </RootLayout>
                </div>
            </div>
            <Footer />
        </main>
    );
};

export default Detail;