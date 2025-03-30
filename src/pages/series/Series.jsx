import React, { useEffect, useState } from 'react';
import RootLayout from '../../layout/RootLayout';
import { Link } from 'react-router-dom';
import { LuChevronsRight } from 'react-icons/lu';
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import MovieCard from '../../components/movieCard/MovieCard';

const Series = () => {
    const breakpoints = {
        '@0.00': {
            slidesPerView: 3,
            spaceBetween: 10,
        },
        '@0.75': {
            slidesPerView: 3,
            spaceBetween: 10,
        },
        '@1.00': {
            slidesPerView: 4,
            spaceBetween: 10,
        },
        '@1.50': {
            slidesPerView: 5,
            spaceBetween: 10,
        },
    };

    const { user } = useSelector((state) => state.auth);
    const [series, setSeries] = useState([]);

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/v1/movie/allMovie", {
                    params: { userId: user?.userId, type: true, page: 0, pageSize: 10 },
                    headers: { "Accept-language": "vi" },
                });
                console.log("DATA SERIES:", response.data); // Kiểm tra dữ liệu API trả về
                setSeries(response.data || []);
            } catch (error) {
                toast.error("Lỗi khi lấy danh sách series");
                console.error("Lỗi khi lấy danh sách series:", error);
            }
        };

        if (user?.userId) {
            fetchSeries();
        }
    }, [user?.userId]);

    return (
        <div className="w-full">
            <RootLayout className="space-y-3">
                <div className="w-full flex items-center justify-between">
                    {/* Title */}
                    <h1 className="md:text-xl text-lg text-neutral-200 font-medium">Series</h1>

                    {/* See All */}
                    <Link
                        to="/series"
                        className="text-sm font-normal flex items-center gap-x-1 text-neutral-400 hover:text-red-500 ease-in-out duration-300"
                    >
                        See All
                        <LuChevronsRight className="w-4 h-4 inline group-hover:translate-x-1 ease-in-out duration-300" />
                    </Link>
                </div>

                {/* Movie card */}
                <div className="w-full">
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={10}
                        loop={true}
                        breakpoints={breakpoints}
                        modules={[Navigation]}
                        navigation
                        className="mySwiper"
                    >
                        {series.length > 0 ? (
                            series.map((movie, index) => (
                                <SwiperSlide
                                    key={index}
                                    className="w-full md:aspect-video aspect-[9/12] bg-neutral-900/20 rounded-md border border-neutral-900/5 overflow-hidden relative"
                                >
                                    <MovieCard
                                        movieCode={movie.movieCode}
                                        img={movie.imageUrl}
                                        title={movie.movieName}
                                        playProgress={0}
                                        censorship={movie.censorship}
                                        isHot={movie.isHot}
                                        language={movie.language}
                                        releaseDate={movie.releaseDate}
                                        duration={movie.duration}
                                        episodes={movie.episodes?.length || 0} // Truyền số tập vào MovieCard
                                    />
                                </SwiperSlide>
                            ))
                        ) : (
                            <SwiperSlide>
                                <p className="text-neutral-400 text-center py-4">Không có dữ liệu</p>
                            </SwiperSlide>
                        )}
                    </Swiper>
                </div>
            </RootLayout>
        </div>
    );
};

export default Series;