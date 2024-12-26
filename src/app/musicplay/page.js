'use client';
import React, { useState, useRef, useEffect } from 'react';
import MusicPlayer from './musicplayer';
import Lyrics from './Lyrics';

export default function MusicPlayPage() {
    const [currentTime, setCurrentTime] = useState(0);
    const [currentTrack, setCurrentTrack] = useState(0);
    //http://music.163.com/song/media/outer/url?id=447925558.mp3
    const [src, setSrc] = useState('');
    // 音乐列表
    const playlist = [
        {
            id: '865632948',
            title: '若把你'
        },
        {
            id: '557584888',
            title: '往后余生'
        },
        {
            id: '202373',
            title: '南方姑娘'
        }

    ];
    const handleTimeUpdate = (time) => {
        setCurrentTime(time);
    };
    // 处理下一首歌曲
    const handleNext = () => {
        console.log("Playing next song");
        setCurrentTrack((prev) => (prev + 1) % playlist.length);
    };

    // 处理上一首歌曲 
    const handlePrevious = () => {
        console.log("Playing previous song");
        setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
    };
    // 处理歌词点击事件
    const handleSeek = (time) => {
        console.log('Seeking to time:', time);
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = time;
            setCurrentTime(time);
        } else {
            console.error('Audio element not found');
        }
    };



    useEffect(() => {
        setSrc("https://music.163.com/song/media/outer/url?id=" + playlist[currentTrack].id + ".mp3");
    }, [currentTrack]);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* 播放器部分 */}
                    <div>
                        <MusicPlayer
                            src={src}
                            currentTrack={currentTrack}
                            onTimeUpdate={handleTimeUpdate}
                            onSeek={handleSeek}
                            onNext={handleNext}
                            onPrevious={handlePrevious}
                        />
                    </div>

                    {/* 歌词部分 */}
                    <div className="bg-gray-50 rounded-lg">
                        <Lyrics
                            songId={playlist[currentTrack].id}
                            currentTime={currentTime}
                            onSeek={handleSeek}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
