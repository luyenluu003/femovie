import React from 'react';
import { Link } from 'react-router-dom';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

const ActorList = ({ actors }) => {
    const breakpoints = {
        '@0.00': {
            slidesPerView: 2,
            spaceBetween: 10,
        },
        '@0.75': {
            slidesPerView: 3,
            spaceBetween: 15,
        },
        '@1.00': {
            slidesPerView: 4,
            spaceBetween: 20,
        },
        '@1.50': {
            slidesPerView: 5,
            spaceBetween: 20,
        },
    };

    return (
        <div className="w-full space-y-6">
            <h2 className="text-xl text-neutral-300 font-bold tracking-wider uppercase">Diễn viên nổi bật</h2>
            <Swiper
                slidesPerView={1}
                spaceBetween={10}
                loop = {true} 
                breakpoints= {breakpoints}
                className="mySwiper"
            >
                {actors && actors.length > 0 ? (
                    actors.map((actor) => (
                        <SwiperSlide key={actor.actorCode}>
                            <Link
                                to={`/actor/${actor.actorCode}`}
                                className="group bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-500 ease-in-out"
                            >
                                <div className="relative overflow-hidden rounded-t-3xl">
                                    <img
                                        src={actor.avatar}
                                        alt={actor.name}
                                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110 rounded-t-3xl"
                                    />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent transition-opacity duration-300 group-hover:opacity-90"></div>
                                    <div className="absolute top-3 right-3">
                                        <span
                                            className={`px-3 py-1 text-xs font-semibold rounded-full shadow-md ${
                                                actor.status
                                                    ? 'bg-green-600/30 text-green-300 border border-green-500/60'
                                                    : 'bg-blue-600/30 text-blue-300 border border-blue-500/60'
                                            } transition-colors duration-300 group-hover:bg-opacity-100`}
                                        >
                                            {actor.status ? 'Tác giả' : 'Diễn viên'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5 bg-neutral-900 rounded-b-3xl">
                                    <h3 className="text-neutral-100 text-lg font-bold truncate tracking-tight">{actor.name}</h3>
                                    <p className="text-neutral-500 text-sm mt-2 opacity-80 italic">Xem thông tin chi tiết</p>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))
                ) : (
                    <SwiperSlide>
                        <p className="text-neutral-400 text-sm text-center py-6">Không có diễn viên nào để hiển thị.</p>
                    </SwiperSlide>
                )}
            </Swiper>
        </div>
    );
};

export default ActorList;