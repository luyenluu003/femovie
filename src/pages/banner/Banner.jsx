import React, { useEffect, useState } from "react";
import RootLayout from "../../layout/RootLayout";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Banner = () => {
    const { user } = useSelector((state) => state.auth);
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0); // Index banner hiện tại

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/v1/banner/bannerAll", {
                    params: { userId: user?.userId },
                    headers: { "Accept-language": "vi" }
                });
                // console.log("DATA BANNER:", response.data); // Kiểm tra dữ liệu API trả về
                setBanners(response.data || []);
            } catch (error) {
                toast.error("Lỗi khi lấy danh sách banner");
                console.error("Lỗi khi lấy danh sách banner:", error);
            }
        };

        if (user?.userId) {
            fetchBanners();
        }
    }, [user?.userId]);

    // Tự động chuyển banner mỗi 5 giây
    // useEffect(() => {
    //     if (banners.length > 1) {
    //         const interval = setInterval(() => {
    //             setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    //         }, 10000);
    //         return () => clearInterval(interval);
    //     }
    // }, [banners]);

    // Hàm chuyển banner tiếp theo
    const nextBanner = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    };

    // Hàm quay lại banner trước
    const prevBanner = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
    };

    return (
        <div className="w-full h-[100vh] relative">
            {banners.length > 0 ? (
                <div
                    className="w-full h-full bg-cover bg-no-repeat bg-center transition-all duration-700 ease-in-out"
                    style={{ backgroundImage: `url(${banners[currentIndex].bannerImage})` }}
                >
                    <RootLayout className="w-full flex-1 h-full pt-[8ch] flex justify-center flex-col bg-gradient-to-tr from-neutral-950/80 to-transparent">
                        <div className="md:w-1/2 w-full h-full space-y-10 flex flex-col justify-center">
                            <h1 className="md:text-5xl text-4xl text-neutral-50 font-bold uppercase tracking-widest md:leading-snug leading-[1.4]">
                                {banners[currentIndex].title}
                            </h1>
                        </div>
                    </RootLayout>

                    {/* Nút Chuyển Banner */}
                    <button 
                        onClick={prevBanner}
                        className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-black/50 cursor-pointer text-white px-4 py-4 rounded-full 
                            hover:bg-black/70 hover:scale-110 transition-all duration-300"
                    >
                        <IoIosArrowBack className="text-2xl"/>

                    </button>
                    <button 
                        onClick={nextBanner}
                        className="absolute right-5 top-1/2 transform -translate-y-1/2 
                            bg-black/50 cursor-pointer text-white px-4 py-4 rounded-full 
                            hover:bg-black/70 hover:scale-110 transition-all duration-300"
                    >
                        <IoIosArrowForward className="text-2xl"/>
                    </button> 
                </div>
            ) : (
                <div className='w-full h-[100vh] bg-[url("./assets/herobg.png")] bg-cover bg-no-repeat md:bg-center bg-right'>
                <RootLayout className={"w-full flex-1 h-full pt-[8ch] flex justify-center flex-col bg-gradient-to-tr from-neutral-950/80 to-transparent"}>
                    <div className='md:w-1/2 w-full h-full space-y-10 flex flex-col justify-center'>
                        <div className='md:text-5xl text-4xl text-neutral-50 font-bold uppercase tracking-widest md:keading-snug leading-[1.4]'>
                            Đón chờ những bộ phim mới nhất từ kênh nhé
                        </div>
                    </div>
                </RootLayout>
            </div>
            )}
        </div>
    );
};

export default Banner;
