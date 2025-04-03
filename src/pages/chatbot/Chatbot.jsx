import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    role: 'assistant',
                    content:
                        'Xin chào! Tôi là trợ lý phim của Yui. Bạn muốn xem phim gì hôm nay? Tôi có thể giúp bạn tìm phim theo thể loại, diễn viên hoặc tâm trạng của bạn.',
                },
            ]);
        }
    }, [isOpen, messages.length]);

    const handleSendMessage = async () => {
        if (input.trim() === '') return;

        const userMessage = { role: 'user', content: input };
        setMessages([...messages, userMessage]);
        setInput('');
        setIsLoading(true);

        const filteredChatHistory = messages
            .filter((msg) => msg.role === 'user' || msg.role === 'assistant')
            .map((msg) => ({
                role: msg.role,
                content: msg.content,
            }));

        const requestData = {
            message: input,
            chatHistory: filteredChatHistory,
        };
        console.log('Request data gửi đi:', requestData);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/v1/chatbot/chat`,
                requestData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            const botResponse = {
                role: 'assistant',
                content: response.data.message,
                movies: response.data.recommendedMovies || [],
            };

            setMessages((prev) => [...prev, botResponse]);
        } catch (error) {
            console.error('Lỗi khi gửi tin nhắn:', error.response?.data || error.message);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.',
                },
            ]);
        }

        setIsLoading(false);
    };

    const getYearFromTimestamp = (timestamp) => {
        return new Date(timestamp).getFullYear();
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
                >
                    <span className="text-xl">🎬</span>
                    <span className="font-semibold">Trợ lý phim</span>
                </button>
            ) : (
                <div className="w-96 max-h-[600px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-xl flex justify-between items-center">
                        <h3 className="text-lg font-bold tracking-wide">Trợ lý phim Yui</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-gray-200 text-2xl font-semibold transition"
                        >
                            ×
                        </button>
                    </div>
                    <div
                        className="flex-1 p-4 overflow-y-auto bg-opacity-80 backdrop-blur-sm"
                        style={{
                            backgroundImage: `url('https://image.dienthoaivui.com.vn/x,webp,q90/https://dashboard.dienthoaivui.com.vn/uploads/dashboard/editor_upload/hinh-nen-anime-48.jpg')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className="flex flex-col w-full">
                                    <div
                                        className={`max-w-[75%] p-3 rounded-lg shadow-md ${msg.role === 'user'
                                                ? 'bg-blue-500 text-white self-end'
                                                : 'bg-white text-gray-900 self-start'
                                            }`}
                                    >
                                        {msg.content}
                                    </div>

                                    {msg.movies && msg.movies.length > 0 && (
                                        <div className="mt-3 w-full">
                                            {msg.movies.map((movie) => (
                                                <div
                                                    key={movie.movieCode}
                                                    className="flex items-center gap-3 p-3 bg-white bg-opacity-90 rounded-lg shadow-md mt-2 hover:bg-opacity-100 transition"
                                                >
                                                    W
                                                    <img
                                                        src={movie.imageUrl}
                                                        alt={movie.movieName}
                                                        className="w-16 h-24 object-cover rounded-md shadow-sm"
                                                    />
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-semibold text-gray-800">
                                                            {movie.movieName}
                                                        </h4>
                                                        <p className="text-xs text-gray-600">
                                                            {getYearFromTimestamp(movie.releaseDate)} •{' '}
                                                            {movie.movieGenre || 'Không rõ thể loại'}
                                                        </p>
                                                        <Link
                                                            to={`/movie-detail/${movie.movieCode}`}
                                                            className="text-blue-600 text-xs font-medium hover:underline"
                                                        >
                                                            Xem chi tiết
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start mb-4">
                                <div className="bg-white p-3 rounded-lg shadow-md flex items-center gap-1">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Nhập yêu cầu tìm phim của bạn..."
                                disabled={isLoading}
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 bg-white shadow-sm"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:bg-gray-400 transition shadow-md"
                            >
                                {isLoading ? '...' : '➤'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;