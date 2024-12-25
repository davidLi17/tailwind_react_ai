'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

function MusicPlayer({ src, onNext, onPrevious }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [seekValue, setSeekValue] = useState(0);
    const [volume, setVolume] = useState(1);
    const audioRef = useRef(null);

    // 初始化音频事件监听
    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) {
            console.error('Audio element is not initialized');
            return;
        }

        const handleLoadedMetadata = () => {
            console.log('Audio loaded metadata:');
            console.log('Duration:', audio.duration);
            setDuration(audio.duration);
        };

        const handleTimeUpdate = () => {
            console.log('Audio time update:');
            console.log('Current Time:', audio.currentTime);
            setCurrentTime(audio.currentTime);
            setSeekValue((audio.currentTime / audio.duration) * 100);
        };

        const handleEnded = () => {
            console.log('Audio playback ended');
            setIsPlaying(false);
            if (onNext) {
                console.log('Triggering next track...');
                onNext();
            }
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        // 清理事件监听器
        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [onNext]);

    // 时间格式化为 MM:SS
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // 播放和暂停
    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (!audio) {
            console.error('Audio element is not initialized');
            return;
        }

        if (isPlaying) {
            console.log('Pausing audio...');
            audio.pause();
        } else {
            console.log('Playing audio...');
            audio.play().catch((error) => {
                console.error('Error playing audio:', error);
                setIsPlaying(false);
            });
        }
        setIsPlaying(!isPlaying);
    };

    // 跳转进度
    const handleSeekChange = (e) => {
        const value = parseFloat(e.target.value);
        const seekTime = (value / 100) * duration;
        const audio = audioRef.current;

        if (!audio) {
            console.error('Audio element is not initialized');
            return;
        }

        console.log('Seeking to:', seekTime);
        audio.currentTime = seekTime;
        setSeekValue(value);
    };

    // 调整音量
    const handleVolumeChange = (e) => {
        const value = parseFloat(e.target.value);
        const audio = audioRef.current;

        if (!audio) {
            console.error('Audio element is not initialized');
            return;
        }

        console.log('Setting volume to:', value);
        setVolume(value);
        audio.volume = value;
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mx-auto mt-10">
            <audio ref={audioRef} src={src} preload="metadata" />

            <div className="flex items-center justify-center mb-4">
                <button
                    onClick={() => {
                        console.log('Previous track clicked');
                        onPrevious && onPrevious();
                    }}
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
                    onClick={() => {
                        console.log('Next track clicked');
                        onNext && onNext();
                    }}
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
                <span>{formatTime(currentTime)}</span>
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
