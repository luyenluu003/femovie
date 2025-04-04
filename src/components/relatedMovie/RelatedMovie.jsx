import React, { useEffect, useState } from 'react'
import RootLayout from '../../layout/RootLayout'
import { Link } from 'react-router-dom'
import { LuChevronsRight } from 'react-icons/lu'

import 'swiper/css'
import 'swiper/css/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-toastify'
import MovieCard from '../../components/movieCard/MovieCard'

const RelatedMovie = () => {

    const breakpoints = {
        '@0.00' : {
            slidesPerView: 3,
            spaceBetween: 10,
        },
        '@0.75' : {
            slidesPerView: 3,
            spaceBetween: 10,
        },
        '@1.00' : {
            slidesPerView: 4,
            spaceBetween: 10,
        },
        '@1.50' : {
            slidesPerView: 4,
            spaceBetween: 10,
        },

    }

    const { user } = useSelector((state) => state.auth);
    const [series, setSeries] = useState([]);

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/v1/movie/allMovie", {
                    params: { userId: user?.userId , type: false, page: 0 , pageSize: 10 },
                    headers: { "Accept-language": "vi" }
                });
                // console.log("DATA SERIES:", response.data); // Kiểm tra dữ liệu API trả về
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

    // console.log("SERIES ====>", series)

    return(
        <div className='w-full'>
            <div className='w-full'>
                <Swiper
                        slidesPerView= {1} 
                        spaceBetween= {10}
                        loop = {true} 
                        breakpoints= {breakpoints}
                        className="mySwiper"
                    >
                        {series.length > 0 ? (
                            series.map((movie, index) => (
                                <SwiperSlide key={index} className="w-full  md:aspect-video aspect-[9/12] bg-neutral-900/20 rounded-md border border-neutral-900/5 overflow-hidden relative">
                                    <MovieCard
                                        movieCode = {movie.movieCode}
                                        img= {movie.imageUrl} // Thay bằng URL ảnh từ API
                                        title= {movie.movieName} // Thay bằng tên phim từ API
                                        // playProgress= {0} // Tiến độ xem (mặc định 0)
                                        // censorship = {movie.censorship}
                                        isHot= {movie.isHot}
                                        // language= {movie.language}
                                        // releaseDate= {movie.releaseDate}
                                        // duration= {movie.duration}
                                        isVip={movie.isVip}
                                    />
                                </SwiperSlide>
                                ))
                            ) : (
                            <p className="text-neutral-400 text-center py-4">Không có dữ liệu</p>
                        )}  
                    </Swiper>
                </div>
        </div>
    )
}

export default RelatedMovie