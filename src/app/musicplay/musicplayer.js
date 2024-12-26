'use client';
import React, { useState, useRef, useEffect, use } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

function MusicPlayer({ src, onNext, onPrevious, onTimeUpdate, onSeek, currentTime }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [seekValue, setSeekValue] = useState(0);
    const [volume, setVolume] = useState(1);
    const audioRef = useRef(null);
    const isSeekingRef = useRef(false);  // 添加一个标记来追踪是否正在手动跳转

    // 只在外部强制跳转时（比如点击歌词）更新音频时间
    useEffect(() => {
        if (audioRef.current && !isSeekingRef.current) {
            const timeDiff = Math.abs(audioRef.current.currentTime - currentTime);
            // 只有当时间差异较大时才进行跳转，避免小的时间差导致的频繁更新
            if (timeDiff > 0.5) {
                audioRef.current.currentTime = currentTime;
            }
        }
    }, [currentTime]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        const handleTimeUpdate = () => {
            if (!isSeekingRef.current) {
                const currentTime = audio.currentTime;
                setSeekValue((currentTime / audio.duration) * 100);
                onTimeUpdate?.(currentTime);
            }
        };

        const handleEnded = () => {
            setIsPlaying(false);
            onNext?.();
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [onNext, onTimeUpdate]);

    const togglePlayPause = () => {
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
    };

    const handleSeekChange = (e) => {
        const value = parseFloat(e.target.value);
        const seekTime = (value / 100) * duration;
        const audio = audioRef.current;

        if (!audio) return;

        isSeekingRef.current = true;  // 标记开始跳转
        audio.currentTime = seekTime;
        setSeekValue(value);
        onSeek?.(seekTime);

        // 使用 setTimeout 确保在处理完成后重置标记
        setTimeout(() => {
            isSeekingRef.current = false;
        }, 100);
    };

    const handleVolumeChange = (e) => {
        const value = parseFloat(e.target.value);
        if (!audioRef.current) return;
        setVolume(value);
        audioRef.current.volume = value;
    };

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mx-auto mt-10">
            <audio
                ref={audioRef}
                src={src}
                preload="metadata"
            />

            <div className="flex items-center justify-center mb-4">
                <button
                    onClick={onPrevious}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Previous track"
                >
                    <SkipBack className="w-6 h-6" />
                </button>

                <button
                    className="mx-4 bg-blue-500 hover:bg-blue-600 text-white font-bold p-3 rounded-full transition-colors"
                    onClick={togglePlayPause}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>

                <button
                    onClick={onNext}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Next track"
                >
                    <SkipForward className="w-6 h-6" />
                </button>
            </div>

            <div className="relative w-full mb-4">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={seekValue}
                    onChange={handleSeekChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-label="Seek"
                />
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 transition-all duration-100"
                        style={{ width: `${seekValue}%` }}
                    />
                </div>
            </div>

            <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
                <span>{formatTime(duration)}</span>
            </div>

            <div className="flex items-center">
                <Volume2 className="w-6 h-6 mr-2" />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 bg-gray-200 rounded-full cursor-pointer"
                    aria-label="Volume"
                />
            </div>
        </div>
    );
}
export default MusicPlayer;
