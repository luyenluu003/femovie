import React, { useEffect, useRef, useState } from "react";
import { MdHd } from "react-icons/md";
import { Link } from "react-router-dom";

const MovieCard2 = ({
    movieCode,
    img,
    title,
    censorship,
    isHot,
    language,
    releaseDate,
    duration,
    episodes,
    isVip, // Thêm prop isVip
}) => {
    const titleRef = useRef(null);
    const [isOverflowed, setIsOverflowed] = useState(false);

    useEffect(() => {
        if (titleRef.current) {
            setIsOverflowed(titleRef.current.scrollWidth > titleRef.current.clientWidth);
        }
    }, [title]);

    return (
        <Link
            to={`/movie-detail/${movieCode}`}
            className="col-span-1 space-y-2 border border-transparent hover:border-neutral-800 rounded-xl transition-all duration-300 group overflow-hidden"
        >
            {/* Hình ảnh */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <img src={img} alt="movie" className="w-full h-full object-cover object-center" />

                {/* Hiển thị HD Icon */}
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                    <MdHd className="w-4 h-4 text-yellow-400" />
                    HD
                </div>

                {/* Hiển thị nhãn HOT nếu có */}
                {isHot ? (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md font-bold">
                        HOT
                    </div>
                ) : null}

                {/* Hiển thị nhãn VIP nếu có */}
                {isVip ? (
                    <div className="absolute bottom-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-md font-bold">
                        VIP
                    </div>
                ) : null}
            </div>

            {/* Nội dung */}
            <div className="p-2 space-y-2">
                {/* Tiêu đề với hiệu ứng marquee */}
                <h1
                    ref={titleRef}
                    className="relative text-neutral-50 font-semibold text-sm overflow-hidden whitespace-nowrap w-full"
                >
                    <span
                        className={`inline-block transition-transform duration-500 ease-linear ${
                            isOverflowed ? "hover:animate-marquee" : ""
                        }`}
                    >
                        {title}
                    </span>

                    <style>
                        {`
                            @keyframes marquee {
                                from { transform: translateX(0%); }
                                to { transform: translateX(-100%); }
                            }
                            .hover\\:animate-marquee:hover {
                                animation: marquee 5s linear infinite;
                            }
                        `}
                    </style>
                </h1>

                {/* Thông tin phim */}
                <div className="flex items-center flex-wrap gap-2 text-xs text-neutral-400">
                    <p>{new Date(releaseDate).toLocaleDateString("vi-VN")}</p>
                    <span className="text-neutral-600">•</span>
                    
                    {episodes > 0 ? (
                        <p className="text-neutral-300 text-xs">{episodes} tập</p>
                    ) : (
                        duration && <p>{duration} phút</p>
                    )}
                    
                    <span className="text-neutral-600">•</span>
                    <p>{censorship}+</p>
                    <span className="text-neutral-600">•</span>
                    <p>{language}</p>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard2;