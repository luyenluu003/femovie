import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({
    movieCode,
    img,
    title,
    playProgress,
    censorship,
    isHot,
    language,
    releaseDate,
    duration,
    episodes,
}) => {
    return (
        <Link to={`/movie-detail/${movieCode}`} className="w-full aspect-video rounded-md overflow-hidden relative">
            {/* Ảnh phim */}
            <img src={img} alt={title} className="w-full h-full object-cover object-center" />

            {/* "Hot" Tag */}
            {isHot ? (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md">
                    HOT
                </div>
            ) : null}

            {/* Overlay chứa thông tin phim */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-neutral-950 to-transparent">
                <p className="text-sm text-neutral-200 font-medium">{title}</p>
                
                {/* Số tập (nếu có, không hiển thị thời lượng) */}
                {episodes > 0 ? (
                    <p className="text-neutral-300 text-xs">{episodes} tập</p>
                ) : (
                    duration && (
                        <p className="text-xs text-neutral-400">Thời lượng: {duration} phút</p>
                    )
                )}

                {/* Ngôn ngữ và độ tuổi */}
                {censorship ? (
                    <p className="text-xs text-neutral-400">{language} | C{censorship}+</p>
                ) : null}

                {/* Ngày phát hành */}
                {language ? (
                    <p className="text-xs text-neutral-400">
                        Phát hành: {new Date(releaseDate).toLocaleDateString("vi-VN")}
                    </p>
                ) : null}
            </div>

            {/* Thanh tiến trình xem */}
            {playProgress ? (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-neutral-800">
                    <div
                        className="bg-green-500 h-full rounded-r-full"
                        style={{ width: `${playProgress}%` }}
                    ></div>
                </div>
            ) : null}
        </Link>
    );
};

export default MovieCard;