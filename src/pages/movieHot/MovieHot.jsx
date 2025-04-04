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

const MovieHot = () => {

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
            slidesPerView: 5,
            spaceBetween: 10,
        },

    }

    const { user } = useSelector((state) => state.auth);
    const [moviesHot, setMoviesHot] = useState([]);


    useEffect(() => {
        const fetchMoviesHot = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/v1/movie/moviehot", {
                    params: { userId: user?.userId , isHot: 1, page: 0 , pageSize: 10 },
                    headers: { "Accept-language": "vi" }
                });
                setMoviesHot(response.data || []);
            } catch (error) {
                toast.error("Lỗi khi lấy danh sách movie hot");
                console.error("Lỗi khi lấy danh sách movie hot:", error);
            }
        };

        if (user?.userId) {
            fetchMoviesHot();
        }
    }, [user?.userId]);

    // console.log("MOVIES HOT ====>", moviesHot)

    return(
        <div className='w-full'>
            <RootLayout className={"space-y-3"}>
                <div className='w-full flex items-center justify-between'> 
                    {/* Title */}
                    <h1 className='md:text-xl text-lg text-neutral-200 font-medium'>
                        Movie Hot
                    </h1>

                    {/* See All */}
                    <Link to="/moviehots" className='text-sm font-normal flex items-center gap-x-1 text-neutral-400 hover:text-red-500 ease-in-out duration-300'>
                        See All
                        <LuChevronsRight className='w-4 h-4 inline group-hover:translate-x-1 ease-in-out duration-300' />
                    </Link>
                </div>

                {/* Movie card */}
                <div className='w-full'>
                   
                    <Swiper
                        slidesPerView= {1} 
                        spaceBetween= {10}
                        loop = {true} 
                        breakpoints= {breakpoints}
                        className="mySwiper"
                    >
                        {moviesHot.length > 0 ? (
                            moviesHot.map((movie, index) => (
                                <SwiperSlide key={index} className="w-full  md:aspect-video aspect-[9/12] bg-neutral-900/20 rounded-md border border-neutral-900/5 overflow-hidden relative">
                                    <MovieCard
                                        movieCode= {movie.movieCode}
                                        img= {movie.imageUrl} // Thay bằng URL ảnh từ API
                                        title= {movie.movieName} // Thay bằng tên phim từ API
                                        playProgress= {0} // Tiến độ xem (mặc định 0)
                                        censorship = {movie.censorship}
                                        isHot= {movie.isHot}
                                        language= {movie.language}
                                        releaseDate= {movie.releaseDate}
                                        duration= {movie.duration}
                                        episodes={movie.episodes?.length || 0} 
                                        isVip={movie.isVip}
                                    />
                                </SwiperSlide>
                                ))
                            ) : (
                            <p className="text-neutral-400 text-center py-4">Không có dữ liệu</p>
                        )}  
                    </Swiper>
                </div>
            </RootLayout>

        </div>
    )
}

export default MovieHot