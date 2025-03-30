import React, { useEffect, useState } from 'react'
import RootLayout from '../../layout/RootLayout'
import { Link } from 'react-router-dom'
import { LuChevronsRight } from 'react-icons/lu'

import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import axios from 'axios'
import MovieCard from '../../components/movieCard/MovieCard'

const MovieWatching = () => {

    const breakpoints = {
        '@0.00' : {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        '@0.75' : {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        '@1.00' : {
            slidesPerView: 3,
            spaceBetween: 20,
        },
        '@1.50' : {
            slidesPerView: 4,
            spaceBetween: 20,
        },

    }

    const { user } = useSelector((state) => state.auth);
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/v1/movie/allMovie", {
                    params: { userId: user?.userId , type: false, page: 0 , pageSize: 10 },
                    headers: { "Accept-language": "vi" }
                });
                // console.log("DATA MOVIES:", response.data); // Kiểm tra dữ liệu API trả về
                setMovies(response.data || []);
            } catch (error) {
                toast.error("Lỗi khi lấy danh sách movie");
                console.error("Lỗi khi lấy danh sách movie:", error);
            }
        };

        if (user?.userId) {
            fetchMovies();
        }
    }, [user?.userId]);

    // console.log("MOVIES ====>", movies)

    return (
        <div className='w-full'>
            <RootLayout className={"space-y-3"}>
                <div className='w-full flex items-center justify-between'> 
                    {/* Title */}
                    <h1 className='md:text-xl text-lg text-neutral-200 font-medium'>
                        Movie
                    </h1>

                    {/* See All */}
                    <Link to="/movies" className='text-sm font-normal flex items-center gap-x-1 text-neutral-400 hover:text-red-500 ease-in-out duration-300'>
                        See All
                        <LuChevronsRight className='w-4 h-4 inline group-hover:translate-x-1 ease-in-out duration-300' />
                    </Link>
                </div>

                {/* Movie card */}
                <div className='w-full '>
                    <Swiper
                        slidesPerView= {1} 
                        spaceBetween= {10}
                        loop = {true} 
                        breakpoints= {breakpoints}
                        className="mySwiper"
                    >
                        {movies.length > 0 ? (
                            movies.map((movie, index) => (
                                <SwiperSlide key={index} className="w-full md:aspect-video aspect-square bg-neutral-900/20 rounded-md border border-neutral-900/5 overflow-hidden relative">
                                    <MovieCard
                                        movieCode={movie.movieCode}
                                        img= {movie.imageUrl} // Thay bằng URL ảnh từ API
                                        title= {movie.movieName} // Thay bằng tên phim từ API
                                        playProgress= {100} // Tiến độ xem (mặc định 0)
                                        censorship = {movie.censorship}
                                        isHot= {movie.isHot}
                                        language= {movie.language}
                                        releaseDate= {movie.releaseDate}
                                        duration= {movie.duration}
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

export default MovieWatching