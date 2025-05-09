import React, { useEffect, useRef, useState } from "react";
import RootLayout from "../../layout/RootLayout";
import { FaCompress, FaExpand, FaPause, FaPlay, FaVolumeDown, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { TbRewindBackward10, TbRewindForward10 } from "react-icons/tb";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { useLocation } from "react-router-dom";
import Comment from "../../components/comment/Comment";
import { useSelector } from "react-redux";

const VideoPlayer = () => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [progress, setProgress] = useState(0);
    const [skipAmount] = useState(10);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isVideoEnded, setIsVideoEnded] = useState(false);
    const hideControlsTimeoutRef = useRef(null);

    const { user } = useSelector((state) => state.auth);

    const location = useLocation();
    const { videoUrl, episodeNumber, episodes, movieCode } = location.state || {};

    const [currentVideoUrl, setCurrentVideoUrl] = useState(videoUrl);
    const [currentEpisodeNumber, setCurrentEpisodeNumber] = useState(episodeNumber);

    console.log("EPISODES==>", episodes)

    useEffect(() => {
        const interval = setInterval(() => {
            if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
                setDuration(videoRef.current.duration);
                setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const onFullScreenChange = () => {
            if (document.fullscreenElement === null) {
                setIsFullScreen(false);
                setShowControls(true);
            } else {
                setIsFullScreen(true);
                setShowControls(true);
                startHideControlsTimer();
            }
        };

        document.addEventListener("fullscreenchange", onFullScreenChange);
        document.addEventListener("webkitfullscreenchange", onFullScreenChange);
        document.addEventListener("mozfullscreenchange", onFullScreenChange);
        document.addEventListener("MSFullscreenChange", onFullScreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", onFullScreenChange);
            document.removeEventListener("webkitfullscreenchange", onFullScreenChange);
            document.removeEventListener("mozfullscreenchange", onFullScreenChange);
            document.removeEventListener("MSFullscreenChange", onFullScreenChange);
        };
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            const handleEnded = () => {
                setIsPlaying(false);
                setIsVideoEnded(true);
            };
            video.addEventListener("ended", handleEnded);
            return () => video.removeEventListener("ended", handleEnded);
        }
    }, []);

    const startHideControlsTimer = () => {
        if (hideControlsTimeoutRef.current) {
            clearTimeout(hideControlsTimeoutRef.current);
        }
        hideControlsTimeoutRef.current = setTimeout(() => {
            if (isFullScreen) {
                setShowControls(false);
            }
        }, 5000);
    };

    const handleMouseMove = () => {
        if (isFullScreen) {
            setShowControls(true);
            startHideControlsTimer();
        }
    };

    const handleMouseLeave = () => {
        if (isFullScreen) {
            startHideControlsTimer();
        }
    };

    const handleVideoLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
            setIsVideoEnded(false);
        }
        setIsPlaying(!isPlaying);
    };

    const handleSkip = (seconds) => {
        videoRef.current.currentTime += seconds;
    };

    const handleChangeSpeed = (e) => {
        setPlaybackRate(e.target.value);
        videoRef.current.playbackRate = e.target.value;
    };

    const handleProgressChange = (e) => {
        const newProgress = e.target.value;
        const newTime = (newProgress / 100) * duration;
        videoRef.current.currentTime = newTime;
        setProgress(newProgress);
    };

    const handleProgressClick = (e) => {
        const rect = e.target.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const totalWidth = rect.width;
        const newProgress = (clickPosition / totalWidth) * 100;
        const newTime = (newProgress / 100) * duration;
        videoRef.current.currentTime = newTime;
        setProgress(newProgress);
    };

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (isMuted) {
            videoRef.current.volume = volume;
        } else {
            videoRef.current.volume = 0;
        }
    };

    const enterFullScreen = () => {
        if (playerRef.current) {
            if (playerRef.current.requestFullscreen) {
                playerRef.current.requestFullscreen();
            } else if (playerRef.current.webkitRequestFullscreen) {
                playerRef.current.webkitRequestFullscreen();
            } else if (playerRef.current.mozRequestFullScreen) {
                playerRef.current.mozRequestFullScreen();
            }
        }
    };

    const exitFullScreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    const volumeIcon = () => {
        if (isMuted || volume === 0) {
            return <FaVolumeMute />;
        } else if (volume > 0 && volume <= 0.5) {
            return <FaVolumeDown />;
        } else {
            return <FaVolumeUp />;
        }
    };

    const handleEpisodeChange = (newVideoUrl, newEpisodeNumber) => {
        setCurrentVideoUrl(newVideoUrl);
        setCurrentEpisodeNumber(newEpisodeNumber);
        setIsVideoEnded(false);
        setCurrentTime(0);
        setProgress(0);
        setIsPlaying(false);
        if (videoRef.current) {
            videoRef.current.load();
        }
    };

    return (
        <main className="w-full min-h-screen bg-black text-neutral-500 flex flex-col overflow-y-auto">
            <Navbar />
            <div className="w-full min-h-screen space-y-16 flex flex-col">
                <div className="w-full pb-16 pt-[10ch] mt-10">
                    <RootLayout className="">
                        {/* Hiển thị số tập hiện tại nếu là series */}
                        {currentEpisodeNumber && (
                            <h1 className="text-neutral-50 text-2xl mb-4 text-center">
                                Tập {currentEpisodeNumber}
                            </h1>
                        )}

                        <div
                            ref={playerRef}
                            className={`relative w-full md:aspect-[16/8] aspect-auto mx-auto group rounded-xl overflow-hidden ease-in-out duration-300 ${isFullScreen ? "h-screen" : ""}`}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <video
                                src={currentVideoUrl}
                                className="w-full"
                                ref={videoRef}
                                onClick={togglePlayPause}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                onLoadedMetadata={handleVideoLoadedMetadata}
                            />

                            {showControls && (
                                <div className="absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-16 ease-in-out duration-300">
                                    <div className="w-12 h-12 rounded-full bg-neutral-950/40 flex items-center justify-center">
                                        <button className="text-neutral-50" onClick={() => handleSkip(-skipAmount)}>
                                            <TbRewindBackward10 className="w-6 h-6" />
                                        </button>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-neutral-950/40 flex items-center justify-center">
                                        <button className="text-neutral-50" onClick={togglePlayPause}>
                                            {isPlaying ? (
                                                <FaPause className="w-6 h-6" />
                                            ) : (
                                                <FaPlay className="w-6 h-6 ml-0.5" />
                                            )}
                                        </button>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-neutral-950/40 flex items-center justify-center">
                                        <button className="text-neutral-50" onClick={() => handleSkip(+skipAmount)}>
                                            <TbRewindForward10 className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {showControls && (
                                <div className="w-full ease-in-out duration-300">
                                    <div className="absolute bottom-0 w-full bg-black bg-opacity-60 px-4 py-2 flex items-center justify-end gap-10">
                                        <div className="px-2 flex items-center space-x-2">
                                            <button onClick={toggleMute} className="text-neutral-50">
                                                {volumeIcon()}
                                            </button>
                                            <input
                                                type="range"
                                                value={isMuted ? 0 : volume}
                                                onChange={handleVolumeChange}
                                                min={0}
                                                max={1}
                                                step={0.01}
                                                disabled={isMuted}
                                                className="w-24 h-1 bg-neutral-500 cursor-pointer"
                                            />
                                            <span className="text-neutral-50 text-sm font-normal">
                                                {Math.round(volume * 100)}%
                                            </span>
                                        </div>
                                        <select
                                            value={playbackRate}
                                            onChange={handleChangeSpeed}
                                            className="text-neutral-50 bg-neutral-900 rounded-md p-1 cursor-pointer focus:outline-none"
                                        >
                                            <option value={0.5}>0.5x</option>
                                            <option value={1}>1x</option>
                                            <option value={1.5}>1.5x</option>
                                            <option value={2}>2x</option>
                                        </select>
                                        <button
                                            className="text-neutral-50"
                                            onClick={isFullScreen ? exitFullScreen : enterFullScreen}
                                        >
                                            {isFullScreen ? (
                                                <FaCompress className="w-6 h-6" />
                                            ) : (
                                                <FaExpand className="w-6 h-6" />
                                            )}
                                        </button>
                                    </div>

                                    <div
                                        className="absolute bottom-0 w-full border-e-neutral-600 h-1"
                                        onClick={handleProgressClick}
                                    >
                                        <input
                                            type="range"
                                            className="w-full h-1 bg-transparent cursor-pointer"
                                            value={progress}
                                            onChange={handleProgressChange}
                                            min={0}
                                            max={100}
                                        />
                                        <div
                                            className="absolute top-0 left-0 h-1 bg-green-500"
                                            style={{ width: `${progress}%`, transition: "width 0.3s ease-in-out" }}
                                        />
                                    </div>

                                    <div className="absolute bottom-3 left-4 text-neutral-50 text-base font-medium">
                                        <span>
                                            {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : "00:00"}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Danh sách tập phim luôn hiển thị nếu là series */}
                        {episodes?.length > 0 && (
                            <div className="mt-6">
                                <h2 className="text-neutral-50 text-xl mb-4 text-center">Danh sách tập</h2>
                                <div className="flex flex-wrap gap-4 justify-center">
                                    {episodes.map((episode) => (
                                        <button
                                            key={episode.id}
                                            onClick={() => handleEpisodeChange(episode.videoUrl, episode.episodeNumber)}
                                            className={`px-4 py-2 rounded-full transition duration-300 ${
                                                currentEpisodeNumber === episode.episodeNumber
                                                    ? "bg-green-700 text-neutral-50"
                                                    : "bg-green-500 text-neutral-50 hover:bg-green-500/80"
                                            }`}
                                        >
                                            Tập {episode.episodeNumber}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                         <div className="w-full space-y-3 !mt-14">
                            <p className="text-base text-neutral-500 font-medium">Comment:</p>
                            <Comment userId={user?.userId} movieCode={movieCode} />
                        </div>
                    </RootLayout>
                </div>
            </div>
            <Footer />
        </main>
    );
};

export default VideoPlayer;