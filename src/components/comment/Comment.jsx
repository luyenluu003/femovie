import React, { useState, useEffect } from "react";
import axios from "axios";

const Comment = ({ userId, movieCode }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [newReply, setNewReply] = useState({});
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [showReplies, setShowReplies] = useState({});
    const [showFullContent, setShowFullContent] = useState({});
    const [totalComments, setTotalComments] = useState(0);
    const commentsPerPage = 5;
    const maxLength = 100;

    useEffect(() => {
        fetchComments(true);
        fetchTotalCommentCount();
    }, [movieCode]);

    const fetchComments = async (reset = false) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/v1/comment/all-comments?movieCode=${movieCode}`,
                { headers: { "Accept-language": "vi" } }
            );
            console.log("ALL COMMENT", response.data);
            const allComments = response.data;
            const startIndex = reset ? 0 : comments.length;
            const nextComments = allComments.slice(startIndex, startIndex + commentsPerPage);

            if (reset) setComments(nextComments);
            else setComments([...comments, ...nextComments]);
            setHasMore(allComments.length > startIndex + nextComments.length);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const fetchTotalCommentCount = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/v1/comment/total-count?movieCode=${movieCode}`,
                { headers: { "Accept-language": "vi" } }
            );
            setTotalComments(response.data);
        } catch (error) {
            console.error("Error fetching total comment count:", error);
            setTotalComments(0);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim() || !userId) return;
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/v1/comment/add-comment?movieCode=${movieCode}&userId=${userId}&content=${encodeURIComponent(newComment)}`,
                {},
                { headers: { "Accept-language": "vi" } }
            );
            setComments([response.data, ...comments]);
            setNewComment("");
            fetchTotalCommentCount();
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleAddReply = async (commentId) => {
        const replyContent = newReply[commentId]?.trim();
        if (!replyContent || !userId) return;
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/v1/comment/add-reply?commentId=${commentId}&userId=${userId}&content=${encodeURIComponent(replyContent)}`,
                {},
                { headers: { "Accept-language": "vi" } }
            );
            setComments(comments.map((c) => (c.id === commentId ? response.data : c)));
            setNewReply({ ...newReply, [commentId]: "" });
            setShowReplies({ ...showReplies, [commentId]: true });
            fetchTotalCommentCount();
        } catch (error) {
            console.error("Error adding reply:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!userId) return;
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/v1/comment/delete-comment?commentId=${commentId}&userId=${userId}`,
                { headers: { "Accept-language": "vi" } }
            );
            setComments(comments.filter((c) => c.id !== commentId));
            fetchTotalCommentCount();
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleDeleteReply = async (commentId, replyId) => {
        if (!userId) return;
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/v1/comment/delete-reply?commentId=${commentId}&replyId=${replyId}&userId=${userId}`,
                { headers: { "Accept-language": "vi" } }
            );
            setComments(
                comments.map((c) =>
                    c.id === commentId
                        ? { ...c, replies: c.replies.filter((r) => r.replyId !== replyId) }
                        : c
                )
            );
            fetchTotalCommentCount();
        } catch (error) {
            console.error("Error deleting reply:", error);
        }
    };

    const handleReactComment = async (commentId, reactionType) => {
        if (!userId) return;
        try {
            console.log("Reacting to comment:", commentId, "with:", reactionType, "by user:", userId);
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/v1/comment/react?commentId=${commentId}&userId=${userId}&reactionType=${reactionType}`,
                {},
                { headers: { "Accept-language": "vi" } }
            );
            console.log("React response:", response.data);
            setComments(comments.map((c) => (c.id === commentId ? response.data : c)));
        } catch (error) {
            console.error("Error reacting to comment:", error);
        }
    };

    const handleUnreactComment = async (commentId, reactionType) => {
        if (!userId) return;
        try {
            console.log("Unreacting to comment:", commentId, "with:", reactionType, "by user:", userId);
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/v1/comment/unreact?commentId=${commentId}&userId=${userId}&reactionType=${reactionType}`,
                {},
                { headers: { "Accept-language": "vi" } }
            );
            console.log("Unreact response:", response.data);
            setComments(comments.map((c) => (c.id === commentId ? response.data : c)));
        } catch (error) {
            console.error("Error unreacting to comment:", error);
        }
    };

    const handleReactReply = async (commentId, replyId, reactionType) => {
        if (!userId) return;
        try {
            console.log("Reacting to reply:", replyId, "in comment:", commentId, "with:", reactionType, "by user:", userId);
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/v1/comment/reply/react?commentId=${commentId}&replyId=${replyId}&userId=${userId}&reactionType=${reactionType}`,
                {},
                { headers: { "Accept-language": "vi" } }
            );
            console.log("React reply response:", response.data);
            setComments(comments.map((c) => (c.id === commentId ? response.data : c)));
        } catch (error) {
            console.error("Error reacting to reply:", error);
        }
    };

    const handleUnreactReply = async (commentId, replyId, reactionType) => {
        if (!userId) return;
        try {
            console.log("Unreacting to reply:", replyId, "in comment:", commentId, "with:", reactionType, "by user:", userId);
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/v1/comment/reply/unreact?commentId=${commentId}&replyId=${replyId}&userId=${userId}&reactionType=${reactionType}`,
                {},
                { headers: { "Accept-language": "vi" } }
            );
            console.log("Unreact reply response:", response.data);
            setComments(comments.map((c) => (c.id === commentId ? response.data : c)));
        } catch (error) {
            console.error("Error unreacting to reply:", error);
        }
    };

    // Hàm kiểm tra và xử lý chỉ cho phép 1 cảm xúc
    const handleReactionToggleComment = async (commentId, newReaction) => {
        if (!userId) return;

        const comment = comments.find((c) => c.id === commentId);
        const reactions = comment.reactions || {};
        const currentReaction = reactionEmojis.find((emoji) => (reactions[emoji] || []).includes(userId));

        if (currentReaction === newReaction) {
            // Nếu click lại cảm xúc đã chọn, bỏ cảm xúc
            await handleUnreactComment(commentId, newReaction);
        } else if (currentReaction) {
            // Nếu đã có cảm xúc khác, xóa cảm xúc cũ trước khi thêm mới
            await handleUnreactComment(commentId, currentReaction);
            await handleReactComment(commentId, newReaction);
        } else {
            // Nếu chưa có cảm xúc, thêm mới
            await handleReactComment(commentId, newReaction);
        }
    };

    const handleReactionToggleReply = async (commentId, replyId, newReaction) => {
        if (!userId) return;

        const comment = comments.find((c) => c.id === commentId);
        const reply = comment.replies.find((r) => r.replyId === replyId);
        const reactions = reply.reactions || {};
        const currentReaction = reactionEmojis.find((emoji) => (reactions[emoji] || []).includes(userId));

        if (currentReaction === newReaction) {
            // Nếu click lại cảm xúc đã chọn, bỏ cảm xúc
            await handleUnreactReply(commentId, replyId, newReaction);
        } else if (currentReaction) {
            // Nếu đã có cảm xúc khác, xóa cảm xúc cũ trước khi thêm mới
            await handleUnreactReply(commentId, replyId, currentReaction);
            await handleReactReply(commentId, replyId, newReaction);
        } else {
            // Nếu chưa có cảm xúc, thêm mới
            await handleReactReply(commentId, replyId, newReaction);
        }
    };

    const loadMoreComments = () => {
        setPage(page + 1);
        fetchComments();
    };

    const toggleReplies = (commentId) => {
        setShowReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
    };

    const toggleFullContent = (id) => {
        setShowFullContent((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const truncateText = (text, id) => {
        if (text.length <= maxLength || showFullContent[id]) return text;
        return text.substring(0, maxLength) + "...";
    };

    // Danh sách các emoji cảm xúc
    const reactionEmojis = ["👍", "❤️", "😂", "😡", "😲", "👎"];

    return (
        <div className="max-w-2xl p-4 mx-auto my-6 font-sans text-gray-200 rounded-2xl bg-gray-900">
            <h3 className="text-xl text-white mb-4 p-2 flex items-center justify-center">
                Bình luận cho phim ({totalComments} bình luận)
            </h3>

            {/* Form thêm bình luận */}
            <div className="mb-6 m-2 bg-gray-800 p-4 rounded-lg shadow-sm">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    className="w-full min-h-[80px] p-3 border border-gray-700 rounded-md resize-y text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 text-gray-200 placeholder-gray-400 disabled:bg-gray-700"
                    disabled={!userId}
                />
                <div className="flex justify-end mt-2">
                    <button
                        onClick={handleAddComment}
                        disabled={!userId}
                        className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md text-sm disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-700 transition"
                    >
                        Gửi bình luận
                    </button>
                </div>
                {!userId && (
                    <p className="text-red-400 text-xs mt-1 text-right">
                        Vui lòng đăng nhập để bình luận
                    </p>
                )}
            </div>

            {/* Danh sách bình luận */}
            <div className="border border-gray-700 rounded-lg m-2 bg-gray-800 shadow-sm p-4">
                {comments.length === 0 ? (
                    <p className="text-gray-400">Chưa có bình luận nào.</p>
                ) : (
                    comments.map((comment, index) => (
                        <div
                            key={comment.id}
                            className={`pb-4 ${index !== comments.length - 1 ? "mb-4 border-b border-gray-700" : ""}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <img
                                        src={comment.avatar || "https://anhcute.net/wp-content/uploads/2024/11/anh-anime.jpg"}
                                        alt="Avatar"
                                        className="w-8 h-8 rounded-full mr-3"
                                    />
                                    <div className="max-w-md">
                                        <strong className="text-white text-sm">{comment.username}</strong>
                                        <p className="text-gray-300 mt-1 break-words">
                                            {truncateText(comment.content, comment.id)}
                                            {comment.content.length > maxLength && !showFullContent[comment.id] && (
                                                <button
                                                    onClick={() => toggleFullContent(comment.id)}
                                                    className="text-blue-400 text-sm hover:text-blue-300 ml-2"
                                                >
                                                    Xem thêm
                                                </button>
                                            )}
                                            {comment.content.length > maxLength && showFullContent[comment.id] && (
                                                <button
                                                    onClick={() => toggleFullContent(comment.id)}
                                                    className="text-blue-400 text-sm hover:text-blue-300 ml-2"
                                                >
                                                    Thu gọn
                                                </button>
                                            )}
                                        </p>
                                        <small className="text-gray-500 text-xs">
                                            {new Date(comment.commentAt).toLocaleString("vi-VN")}
                                        </small>
                                        {/* Chỉ hiển thị các nút cảm xúc */}
                                        <div className="mt-2 flex space-x-2">
                                            {reactionEmojis.map((emoji) => (
                                                <button
                                                    key={emoji}
                                                    onClick={() => handleReactionToggleComment(comment.id, emoji)}
                                                    className={`text-sm w-10 h-6 cursor-pointer ${(comment.reactions?.[emoji] || []).includes(userId) ? "text-yellow-400" : "text-gray-400"} hover:text-yellow-300`}
                                                >
                                                    {emoji} ({(comment.reactions?.[emoji] || []).length})
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {comment.replies?.length > 0 && (
                                        <button
                                            onClick={() => toggleReplies(comment.id)}
                                            className="text-blue-400 text-sm hover:text-blue-300 transition"
                                        >
                                            {showReplies[comment.id]
                                                ? "Ẩn phản hồi"
                                                : `Hiện ${comment.replies.length} phản hồi`}
                                        </button>
                                    )}
                                    {comment.userId === userId && (
                                        <button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="text-red-400 text-sm hover:text-red-300 transition"
                                        >
                                            Xóa
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Danh sách phản hồi */}
                            {showReplies[comment.id] && comment.replies?.length > 0 && (
                                <div className="ml-10 mt-3">
                                    {comment.replies.map((reply) => (
                                        <div key={reply.replyId} className="flex items-center justify-between mb-2">
                                            <div className="flex items-center">
                                                <img
                                                    src={reply.avatar || "https://via.placeholder.com/20"}
                                                    alt="Avatar"
                                                    className="w-5 h-5 rounded-full mr-2"
                                                />
                                                <div className="max-w-md">
                                                    <strong className="text-white text-sm">{reply.username}</strong>
                                                    <p className="text-gray-300 text-sm break-words">
                                                        {truncateText(reply.content, reply.replyId)}
                                                        {reply.content.length > maxLength && !showFullContent[reply.replyId] && (
                                                            <button
                                                                onClick={() => toggleFullContent(reply.replyId)}
                                                                className="text-blue-400 text-sm hover:text-blue-300 ml-2"
                                                            >
                                                                Xem thêm
                                                            </button>
                                                        )}
                                                        {reply.content.length > maxLength && showFullContent[reply.replyId] && (
                                                            <button
                                                                onClick={() => toggleFullContent(reply.replyId)}
                                                                className="text-blue-400 text-sm hover:text-blue-300 ml-2"
                                                            >
                                                                Thu gọn
                                                            </button>
                                                        )}
                                                    </p>
                                                    <small className="text-gray-500 text-xs">
                                                        {new Date(reply.replyAt).toLocaleString("vi-VN")}
                                                    </small>
                                                    {/* Chỉ hiển thị các nút cảm xúc cho phản hồi */}
                                                    <div className="mt-2 flex space-x-2">
                                                        {reactionEmojis.map((emoji) => (
                                                            <button
                                                                key={emoji}
                                                                onClick={() => handleReactionToggleReply(comment.id, reply.replyId, emoji)}
                                                                className={`text-sm w-10 h-6 cursor-pointer ${(reply.reactions?.[emoji] || []).includes(userId) ? "text-yellow-400" : "text-gray-400"} hover:text-yellow-300`}
                                                            >
                                                                {emoji} ({(reply.reactions?.[emoji] || []).length})
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            {reply.userId === userId && (
                                                <button
                                                    onClick={() => handleDeleteReply(comment.id, reply.replyId)}
                                                    className="text-red-400 text-sm hover:text-red-300 transition"
                                                >
                                                    Xóa
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Form thêm phản hồi */}
                            <div className="ml-10 mt-3 pt-3 border-t border-gray-700">
                                <textarea
                                    value={newReply[comment.id] || ""}
                                    onChange={(e) => setNewReply({ ...newReply, [comment.id]: e.target.value })}
                                    placeholder="Viết phản hồi của bạn..."
                                    className="w-full min-h-[50px] p-2 border border-gray-700 rounded-md resize-y text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-900 text-gray-200 placeholder-gray-400 disabled:bg-gray-700"
                                    disabled={!userId}
                                />
                                <div className="flex justify-end mt-2">
                                    <button
                                        onClick={() => handleAddReply(comment.id)}
                                        disabled={!userId}
                                        className="px-3 py-1 cursor-pointer bg-green-600 text-white rounded-md text-sm disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-green-700 transition"
                                    >
                                        Gửi phản hồi
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Nút Load thêm bình luận */}
            {hasMore && (
                <div className="text-center mt-6">
                    <button
                        onClick={loadMoreComments}
                        className="px-5 py-2 cursor-pointer bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
                    >
                        Load thêm bình luận
                    </button>
                </div>
            )}
        </div>
    );
};

export default Comment;