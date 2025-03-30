import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import RootLayout from "../../layout/RootLayout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const DetailActor = () => {
    const { actorId } = useParams();
    const [actor, setActor] = useState(null);
    const [loading, setLoading] = useState(true);

    const { user } = useSelector((state) => state.auth);


    useEffect(() => {
        const fetchActorDetail = async () => {
            try {
                // Giả định API trả về chi tiết diễn viên
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/v1/actor/detailActor`, {
                    params: { userId: user?.userId ,actorId},
                    headers: { "Accept-language": "vi" }
                });
                setActor(response.data?.data || {});
            } catch (error) {
                toast.error("Lỗi khi lấy thông tin diễn viên");
                console.error("Lỗi khi lấy thông tin diễn viên:", error);
            } finally {
                setLoading(false);
            }
        };

        if (actorId) {
            fetchActorDetail();
        }
    }, [actorId]);

    if (loading) {
        return (
            <main className="w-full min-h-screen bg-neutral-950 flex flex-col">
                <Navbar />
                <div className="w-full min-h-screen flex items-center justify-center">
                    <p className="text-neutral-400 text-lg">Đang tải...</p>
                </div>
                <Footer />
            </main>
        );
    }

    if (!actor) {
        return (
            <main className="w-full min-h-screen bg-neutral-950 flex flex-col">
                <Navbar />
                <div className="w-full min-h-screen flex items-center justify-center">
                    <p className="text-neutral-400 text-lg">Không tìm thấy thông tin diễn viên.</p>
                </div>
                <Footer />
            </main>
        );
    }

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <main className="w-full min-h-screen bg-neutral-950 text-neutral-400 flex flex-col">
            <Navbar />
            <div className="w-full min-h-screen flex flex-col space-y-20">
                <div className="w-full pt-[12ch] pb-20 bg-gradient-to-b from-neutral-900/50 to-neutral-950">
                    <RootLayout className="space-y-16">
                        <div className="w-full grid md:grid-cols-5 grid-cols-1 gap-10 items-start">
                            {/* Avatar */}
                            <div className="md:col-span-2 col-span-1 space-y-4 mx-auto">
                                <div className="relative group">
                                    <img
                                        src={actor.avatar || "https://via.placeholder.com/150"}
                                        alt={actor.name}
                                        className="md:w-[90%] w-full max-w-[350px] aspect-[9/13] object-cover rounded-3xl shadow-xl transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                            </div>

                            {/* Thông tin diễn viên */}
                            <div className="md:col-span-3 col-span-1 space-y-8">
                                <div className="space-y-4">
                                    <h1 className="text-3xl md:text-5xl text-neutral-100 font-extrabold tracking-tight">
                                        {actor.name}
                                    </h1>
                                    <div className="flex items-center gap-x-4">
                                        <span
                                            className={`px-4 py-1.5 text-sm font-semibold rounded-full shadow-md ${
                                                actor.status
                                                    ? "bg-green-600/30 text-green-300 border border-green-500/60"
                                                    : "bg-blue-600/30 text-blue-300 border border-blue-500/60"
                                            }`}
                                        >
                                            {actor.status ? "Tác giả" : "Diễn viên"}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                        <p className="text-base md:text-lg text-neutral-500 font-semibold">Ngày sinh:</p>
                                        <p className="text-base md:text-lg text-neutral-300">{formatDate(actor.dateOfBirth)}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-base md:text-lg text-neutral-500 font-semibold">Tiểu sử:</p>
                                        <p className="text-base md:text-lg text-neutral-300 leading-relaxed">{actor.bio}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </RootLayout>
                </div>
            </div>
            <Footer />
        </main>
    );
};

export default DetailActor;