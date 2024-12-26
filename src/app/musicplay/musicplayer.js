'use client';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

function MusicPlayer({ src, onNext, onPrevious, onTimeUpdate, onSeek, currentTime }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [seekValue, setSeekValue] = useState(0);
    const [volume, setVolume] = useState(1);
    const audioRef = useRef(null);
    const isSeekingRef = useRef(false);

    // 使用 useCallback 优化事件处理函数
    const handleLoadedMetadata = useCallback(() => {
        setDuration(audioRef.current.duration);
    }, []);

    const handleTimeUpdate = useCallback(() => {
        if (!isSeekingRef.current && audioRef.current) {
            const currentTime = audioRef.current.currentTime;
            setSeekValue((currentTime / audioRef.current.duration) * 100);
            onTimeUpdate?.(currentTime);
        }
    }, [onTimeUpdate]);

    const handleEnded = useCallback(() => {
        setIsPlaying(false);
        onNext?.();
    }, [onNext]);

    // 使用 useEffect 监听外部时间变化
    useEffect(() => {
        if (audioRef.current && !isSeekingRef.current) {
            const timeDiff = Math.abs(audioRef.current.currentTime - currentTime);
            if (timeDiff > 0.5) {
                audioRef.current.currentTime = currentTime;
            }
        }
    }, [currentTime]);

    // 事件监听优化
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [handleLoadedMetadata, handleTimeUpdate, handleEnded]);

    const togglePlayPause = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch((error) => {
                console.error('Error playing audio:', error);
                setIsPlaying(false);
            });
        }
        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    const handleSeekChange = useCallback((e) => {
        const value = parseFloat(e.target.value);
        const seekTime = (value / 100) * duration;
        const audio = audioRef.current;

        if (!audio) return;

        isSeekingRef.current = true;
        audio.currentTime = seekTime;
        setSeekValue(value);
        onSeek?.(seekTime);

        setTimeout(() => {
            isSeekingRef.current = false;
        }, 100);
    }, [duration, onSeek]);

    const handleVolumeChange = useCallback((e) => {
        const value = parseFloat(e.target.value);
        if (!audioRef.current) return;
        setVolume(value);
        audioRef.current.volume = value;
    }, []);

    // 使用 useMemo 优化格式化时间函数
    const formatTime = useMemo(() => (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, []);

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mx-auto mt-10 transition-all hover:shadow-xl">
            <audio
                ref={audioRef}
                src={src}
                preload="metadata"
            />

            <div className="flex items-center justify-center mb-4">
                <button
                    onClick={onPrevious}
                    className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 active:scale-95"
                    aria-label="Previous track"
                >
                    <SkipBack className="w-6 h-6" />
                </button>

                <button
                    className="mx-4 bg-blue-500 hover:bg-blue-600 text-white font-bold p-3 rounded-full transition-all duration-300 active:scale-95 transform hover:rotate-3"
                    onClick={togglePlayPause}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>

                <button
                    onClick={onNext}
                    className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 active:scale-95"
                    aria-label="Next track"
                >
                    <SkipForward className="w-6 h-6" />
                </button>
            </div>

            <div className="relative w-full mb-4 group">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={seekValue}
                    onChange={handleSeekChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-label="Seek"
                />
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden group-hover:h-2 transition-all">
                    <div
                        className="h-full bg-blue-500 transition-all duration-100"
                        style={{ width: `${seekValue}%` }}
                    />
                </div>
            </div>

            <div className="flex justify-between text-sm text-gray-600 mb-4 font-medium">
                <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
                <span>{formatTime(duration)}</span>
            </div>

            <div className="flex items-center group">
                <Volume2 className="w-6 h-6 mr-2 group-hover:text-blue-500 transition-colors" />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 bg-gray-200 rounded-full cursor-pointer hover:h-2 transition-all"
                    aria-label="Volume"
                />
            </div>
        </div>
    );
}

export default React.memo(MusicPlayer);
