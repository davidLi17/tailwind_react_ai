'use client';
import React, { useState, useRef, useEffect } from 'react';
import MusicPlayer from './musicplayer';
import Lyrics from './Lyrics';

export default function MusicPlayPage() {
    const [currentTime, setCurrentTime] = useState(0);
    const [currentTrack, setCurrentTrack] = useState(0);
    const [src, setSrc] = useState('');

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

    const handleNext = () => {
        setCurrentTrack((prev) => (prev + 1) % playlist.length);
    };

    const handlePrevious = () => {
        setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
    };

    // We'll pass this down to both Lyrics and MusicPlayer
    const handleSeek = (time) => {
        // Just pass the time to MusicPlayer component
        if (time >= 0) {
            setCurrentTime(time);
        }
    };

    useEffect(() => {
        setSrc(`https://music.163.com/song/media/outer/url?id=${playlist[currentTrack].id}.mp3`);
    }, [currentTrack]);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <MusicPlayer
                            src={src}
                            currentTrack={currentTrack}
                            onTimeUpdate={handleTimeUpdate}
                            onSeek={handleSeek}
                            currentTime={currentTime}  // Add this prop
                            onNext={handleNext}
                            onPrevious={handlePrevious}
                        />
                    </div>
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