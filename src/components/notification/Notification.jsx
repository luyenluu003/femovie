import React, { useState, useEffect, useRef } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import { useSelector } from 'react-redux';
import axios from 'axios';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const Notification = ({ open, handleClose, onNewNotification }) => {
    const { user } = useSelector((state) => state.auth);
    const [notifications, setNotifications] = useState([]);
    const stompClientRef = useRef(null); // Lưu trữ stompClient
    const reconnectTimeoutRef = useRef(null); // Lưu trữ timeout reconnect

    // Hàm kết nối WebSocket
    const connectWebSocket = () => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            return; // Đã kết nối, không cần làm gì
        }

        const socket = new SockJS(`${import.meta.env.VITE_BACKEND_URL}/ws`);
        console.log("Initializing SOCKET ==>", socket);
        const stompClient = Stomp.over(socket);
        stompClientRef.current = stompClient;

        stompClient.connect(
            {},
            () => {
                console.log("WebSocket connected for user:", user?.userId);
                stompClient.subscribe(`/user/${user?.userId}/topic/notifications`, (message) => {
                    console.log("Received realtime notification:", message.body);
                    try {
                        const newNotification = JSON.parse(message.body);
                        setNotifications((prev) => [newNotification, ...prev]);
                        if (onNewNotification) {
                            onNewNotification();
                        }
                    } catch (error) {
                        console.error("Error parsing notification:", error);
                    }
                });
            },
            (error) => {
                console.error("WebSocket connection error:", error);
                // Thử reconnect sau 2 giây
                reconnectTimeoutRef.current = setTimeout(() => {
                    console.log("Attempting to reconnect WebSocket...");
                    connectWebSocket();
                }, 2000);
            }
        );
    };

    // Hàm ngắt kết nối WebSocket
    const disconnectWebSocket = () => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            stompClientRef.current.disconnect(() => {
                console.log("WebSocket disconnected");
            });
            stompClientRef.current = null;
        }
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
    };

    // Fetch thông báo ban đầu
    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/v1/noti/allnotification`, {
                params: { userId: user?.userId },
                headers: { "Accept-language": "vi" },
            });
            setNotifications(response.data || []);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    useEffect(() => {
        if (user?.userId) {
            fetchNotifications();
            connectWebSocket();
        }

        // Cleanup khi component unmount hoặc userId thay đổi
        return () => {
            disconnectWebSocket();
        };
    }, [user?.userId]);

    useEffect(() => {
        console.log("Updated notifications ==>", notifications);
    }, [notifications]);

    return (
        <div
            className={`fixed top-0 h-full bg-neutral-900 text-neutral-50 shadow-lg z-50 transform ${
                open ? "translate-x-0 right-0" : "translate-x-full -right-[100%]"
            } transition-transform duration-300 ease-in-out max-w-[33.33%] w-full rounded-lg`}
        >
            <div className="flex justify-between items-center p-4 bg-neutral-900 border border-neutral-700 rounded-t-lg border-b border-b-neutral-700/60">
                <h2 className="text-lg font-bold">Notifications</h2>
                <button
                    onClick={handleClose}
                    className="text-neutral-50 transition-all duration-200 ease-in-out"
                >
                    <MdOutlineClose className="w-5 h-5" />
                </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto bg-neutral-900 border border-neutral-700 rounded-b-lg border-t-0">
                {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                        <div key={index} className="bg-neutral-800/60 p-3 rounded-lg flex gap-3">
                            {notification.imageUrl && (
                                <div className="flex-shrink-0">
                                    <img
                                        src={notification.imageUrl}
                                        alt={notification.title || "Notification"}
                                        className="w-12 h-12 object-cover rounded-md"
                                        onError={(e) => (e.target.style.display = "none")}
                                    />
                                </div>
                            )}
                            <div className="flex-1 flex flex-col gap-2">
                                <div className="w-full flex items-start justify-between">
                                    <h4 className="text-lg text-neutral-200 font-semibold">
                                        {notification.title || "New Notification"}
                                    </h4>
                                    <span className="text-xs text-neutral-400 text-nowrap pt-1.5">
                                        {notification.startAt
                                            ? new Date(notification.startAt).toLocaleString("vi-VN", {
                                                  day: "2-digit",
                                                  month: "2-digit",
                                                  year: "numeric",
                                              })
                                            : "Just now"}
                                    </span>
                                </div>
                                <p className="text-sm text-neutral-400 font-normal">
                                    {notification.message || "No message available"}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-neutral-500 border-t border-dashed border-neutral-600/80 pt-4 !mt-7">
                        <p>No new notification at this moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notification;

export { Notification };