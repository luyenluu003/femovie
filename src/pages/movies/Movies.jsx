import React, { useEffect, useState } from 'react';
import RootLayout from '../../layout/RootLayout';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import MovieCard2 from '../../components/movieCard/MovieCard2';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { TbReload } from 'react-icons/tb';

const Movies = () => {
    const { user } = useSelector((state) => state.auth);
    const [movies, setMovies] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [page, setPage] = useState(1); 
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 10;

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/v1/category/categoryAll", {
                    params: { userId: user?.userId },
                    headers: { "Accept-language": "vi" }
                });
                setCategories(response.data || []);
            } catch (error) {
                toast.error("Lỗi khi lấy danh sách category");
                console.error("Lỗi khi lấy danh sách category:", error);
            }
        };

        if (user?.userId) {
            fetchCategory();
        }
    }, [user?.userId]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                let url = import.meta.env.VITE_BACKEND_URL + "/v1/movie/allMovie";
                let params = { 
                    userId: user?.userId, 
                    type: false, 
                    page: page,
                    pageSize: pageSize 
                };

                if (selectedCategory) {
                    url = import.meta.env.VITE_BACKEND_URL + "/v1/movie/category";
                    params.categoryId = selectedCategory;
                }

                const response = await axios.get(url, {
                    params,
                    headers: { "Accept-language": "vi" }
                });

                const newMovies = response.data || [];
        
                setMovies(prev => page === 1 ? newMovies : [...prev, ...newMovies]);
            
                setHasMore(newMovies.length === pageSize);
            } catch (error) {
                toast.error("Lỗi khi lấy danh sách movie");
                console.error("Lỗi khi lấy danh sách movie:", error);
            }
        };

        if (user?.userId) {
            fetchMovies();
        }
    }, [selectedCategory, user?.userId, page]);

    const handleLoadMore = () => {
        setPage(prev => prev + 1); 
    };

    useEffect(() => {
        setPage(1); 
        setMovies([]); 
    }, [selectedCategory]);

    return (
        <main className="w-full min-h-screen bg-black text-neutral-500 flex flex-col">
            <Navbar />
            <div className='w-full min-h-screen space-y-16 flex flex-col'>
                <div className='w-full pt-[10ch] pb-16'>
                    <RootLayout className={"space-y-14"}>
                        <div className='w-full flex items-center gap-6'>
                            <div className='flex items-center gap-5'>
                                <p className="text-3xl text-neutral-50 font-semibold">
                                    MOVIES
                                </p>
                                <select
                                    name=""
                                    id=""
                                    className="bg-neutral-950 h-10 px-2 border-2 border-neutral-900 focus:border-neutral-900/50 text-base text-neutral-200 
                                        font-normal rounded-xl focus:outline-none"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSelectedCategory(value === "all" ? "" : value);
                                    }}
                                >
                                    <option value="all">All Genres</option>
                                    {categories.map((category) => (
                                        <option key={category.categoryCode} value={category.categoryCode}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="w-full grid md:grid-cols-5 grid-cols-2 md:gap-x-3 gap-x-2 md:gap-y-6 gap-y-3 items-center">
                            {movies.length > 0 ? (
                                movies.map((movie) => (
                                    <MovieCard2 
                                        key={movie.movieCode || Math.random()} 
                                        movieCode={movie.movieCode}
                                        img={movie.imageUrl} 
                                        title={movie.movieName} 
                                        censorship={movie.censorship}
                                        isHot={movie.isHot}
                                        language={movie.language}
                                        releaseDate={movie.releaseDate}
                                        duration={movie.duration}
                                    />
                                ))
                            ) : (
                                <p className="text-neutral-400 text-center py-4 col-span-full">Không có dữ liệu</p>
                            )}
                        </div>

                        {hasMore && (
                            <div className='w-full flex items-center justify-center'>
                                <button 
                                    onClick={handleLoadMore}
                                    className='md:w-fit w-1/2 px-6 md:py-2.5 py-3 rounded-full capitalize bg-green-500 hover:bg-green-500/10 border-2 border-green-500 hover:border-green-500 flex items-center justify-center gap-x-2 text-base text-neutral-50 hover:text-neutral-100 font-normal ease-in-out duration-300 cursor-pointer'
                                >
                                    <TbReload />
                                    Load More
                                </button>
                            </div>
                        )}
                    </RootLayout>
                </div>
            </div>
            <Footer />
        </main>
    );
}

export default Movies;