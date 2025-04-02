import React, { useEffect, useRef, useState } from 'react';
import { FaSearch, FaPlay } from 'react-icons/fa';
import { FaBars, FaBell, FaX } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Notification from './notification/Notification';
import axios from 'axios';
import { toast } from 'react-toastify';
import UserMenu from './User/UserMenu';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [scrollPosition, setScrollPosition] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [open, setOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [newNotificationCount, setNewNotificationCount] = useState(0);
    const searchRef = useRef(null);
    const userMenuRef = useRef(null);

    const { user } = useSelector((state) => state.auth);
    const userId = user?.userId;

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Series', path: '/series' },
        { label: 'Movies', path: '/movies' },
        { label: 'Hots', path: '/moviehots' },
        { label: 'My Lists', path: `/my-lists/${userId}` },
    ];

    const handleClick = () => setOpen(!open);
    const handleClose = () => setOpen(false);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        dispatch(logout());
        navigate("/login");
    };

    const handleNewNotification = () => {
        setNewNotificationCount((prev) => prev + 1);
    };

    const handleNotificationOpen = () => {
        setIsNotificationOpen(true);
        setNewNotificationCount(0);
    };

    const handleNotificationClose = () => {
        setIsNotificationOpen(false);
    };

    const handleUserMenuToggle = () => {
        setIsUserMenuOpen((prev) => !prev);
    };

    const handleUserMenuClose = () => {
        setIsUserMenuOpen(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            if (currentScroll > scrollPosition && currentScroll > 50) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setScrollPosition(currentScroll);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrollPosition]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setIsSearchOpen(false);
                setSearchResults([]);
                setSuggestions([]);
                setSearchQuery('');
            }
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchSuggestions = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/v1/searchkeyword/allSearchKeyword`, {
                headers: { "Accept-language": "vi" }
            });
            setSuggestions(response.data || []);
        } catch (error) {
            toast.error("Lỗi khi lấy từ khóa gợi ý");
            console.error("Lỗi khi lấy gợi ý:", error.response?.data || error.message);
        }
    };

    const handleSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            const params = {
                userId: userId || 1,
                timestamp: Date.now(),
                groupType: 'movie',
                qrTxt: query,
                page: 0,
                size: 10,
            };
            console.log("Search params:", params);

            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/v1/search/group`, {
                params,
                headers: { "Accept-language": "vi" }
            });

            setSearchResults(response.data.data || []);
        } catch (error) {
            toast.error("Lỗi khi tìm kiếm phim");
            console.error("Lỗi khi tìm kiếm:", error.response?.data || error.message);
        }
    };

    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        console.log("Search query:", query);
        if (query.trim()) {
            handleSearch(query);
            setSuggestions([]);
        } else {
            setSearchResults([]);
            fetchSuggestions();
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion);
        handleSearch(suggestion);
    };

    useEffect(() => {
        if (isSearchOpen && !searchQuery) {
            fetchSuggestions();
        }
    }, [isSearchOpen]);

    return (
        <nav className={`fixed top-0 left-0 lg:px-24 md:px-16 sm:px-7 px-4 w-full h-[8ch] backdrop-blur-md transition-transform duration-300 z-50 ${isVisible ? 'translate-y-0' : '-translate-y-full'} ${scrollPosition > 50 ? 'bg-neutral-900' : 'bg-neutral-900/0'}`}>
            <div className="w-full h-full flex items-center justify-between">
                <Link to="/" className='text-2xl text-green-500 font-bold uppercase mr-16'>
                    YuiChill
                </Link>

                <div className="w-fit md:hidden flex items-center justify-center cursor-pointer flex-col gap-1 text-green-400" onClick={handleClick}>
                    {open ? <FaX className='w-5 h-5' /> : <FaBars className='w-5 h-5' />}
                </div>

                <div className={`${open ? 'flex absolute top-20 left-0 w-full h-auto md:h-auto md:relative' : 'hidden'} flex-1 md:flex flex-col md:flex-row md:gap-14 gap-5 md:items-center md:justify-between md:p-0 sm:p-4 p-4 justify-end md:bg-transparent bg-neutral-900/95 backdrop-blur-3xl transition-transform md:shadow-none sm:shadow-md shadow-md rounded-md`}>
                    <ul className="list-none flex md:items-center items-start flex-wrap md:flex-row flex-col md:gap-8 gap-5 text-sm text-green-400 font-medium uppercase">
                        {navItems.map((item, index) => (
                            <li key={index}>
                                <Link to={item.path} className='hover:text-neutral-200 ease-in-out duration-300'>{item.label}</Link>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center md:justify-center justify-start gap-x-3 text-neutral-400">
                        {/* Search */}
                        <div className='relative' ref={searchRef}>
                            <button className="w-10 h-10 flex items-center justify-center" onClick={() => setIsSearchOpen(true)}>
                                <FaSearch className='w-4 h-4' />
                            </button>

                            <div className={`absolute top-0 right-0 h-11 flex items-center bg-neutral-950 border border-neutral-800 rounded-lg ${isSearchOpen ? 'w-[300px] opacity-100' : 'w-0 opacity-0'} transition-all duration-300 overflow-hidden`}>
                                <input
                                    type="text"
                                    placeholder='Search movie, series, ...'
                                    value={searchQuery}
                                    onChange={handleInputChange}
                                    className="flex-1 h-full border-none bg-transparent focus:outline-none placeholder:text-neutral-500 px-2.5 text-neutral-200"
                                />
                            </div>

                            {isSearchOpen && (
                                <div className="absolute top-12 right-0 w-[300px] max-h-[400px] bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg overflow-y-auto z-50 p-2">
                                    {searchResults.length > 0 ? (
                                        searchResults.map((result) => (
                                            <Link
                                                key={result.movieInfo.movieCode}
                                                to={`/movie-detail/${result.movieInfo.movieCode}`}
                                                className="flex items-center gap-3 p-3 hover:bg-neutral-800 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSearchResults([]);
                                                }}
                                            >
                                                <img
                                                    src={result.avatar}
                                                    alt={result.itemName}
                                                    className="w-12 h-12 object-cover rounded-md"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-neutral-50 font-medium">{result.itemName}</p>
                                                    <p className="text-sm text-neutral-400">{result.movieInfo.movieGenre} • {result.movieInfo.duration} phút</p>
                                                </div>
                                                <FaPlay className="w-4 h-4 text-green-500" />
                                            </Link>
                                        ))
                                    ) : searchQuery ? (
                                        <p className="p-3 text-neutral-400 text-sm">Không tìm thấy kết quả</p>
                                    ) : suggestions.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {suggestions.map((suggestion, index) => (
                                                <div
                                                    key={index}
                                                    className="px-3 py-1 bg-neutral-800 border border-neutral-700 rounded-full text-neutral-50 text-sm cursor-pointer hover:bg-neutral-700 transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSuggestionClick(suggestion.keyword);
                                                    }}
                                                >
                                                    {suggestion.keyword}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="p-3 text-neutral-400 text-sm">Đang tải gợi ý...</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Notification Icon */}
                        <button
                            className="w-10 h-10 relative flex items-center justify-center"
                            onClick={handleNotificationOpen}
                        >
                            <FaBell
                                className={`w-5 h-5 ${newNotificationCount > 0 ? 'text-yellow-400 animate-pulse' : 'text-neutral-400'}`}
                            />
                            {newNotificationCount > 0 && (
                                <span className="absolute top-1 right-3.5 text-xs border border-neutral-950 text-neutral-50 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
                                    {newNotificationCount}
                                </span>
                            )}
                        </button>

                        <Notification
                            open={isNotificationOpen}
                            handleClose={handleNotificationClose}
                            onNewNotification={handleNewNotification}
                            style={{ display: 'none' }}
                        />

                        {/* Avatar - Khi click mở UserMenu */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                className="w-8 h-8 rounded-full border border-neutral-700/70 p-0.5"
                                onClick={handleUserMenuToggle}
                            >
                                <img
                                    src={user?.avatar || "https://anhcute.net/wp-content/uploads/2024/11/anh-anime.jpg"}
                                    alt="avatar"
                                    className="w-full h-full object-cover object-center rounded-full"
                                />
                            </button>

                            {isUserMenuOpen && (
                                <UserMenu user={user} onClose={handleUserMenuClose} onLogout={handleLogout} />
                            )}
                        </div>

                        {/* <button
                            onClick={handleLogout}
                            className="border border-gray-500 rounded-full px-6 py-2 hover:bg-gray-100 transition-all text-green-500"
                        >
                            Logout
                        </button> */}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;