'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Lyrics({ songId, currentTime, onSeek }) {
    const [lyrics, setLyrics] = useState([]);
    const [currentLyricIndex, setCurrentLyricIndex] = useState(0);

    // 解析歌词文本为时间戳和文本数组
    const parseLyrics = (lrcText) => {
        const lines = lrcText.split('\n');
        const timeRegex = /\[(\d{2}):(\d{2})\.(\d{3})\]/;

        return lines
            .map(line => {
                const match = timeRegex.exec(line);
                if (!match) return null;

                const time = (parseInt(match[1]) * 60 +
                    parseInt(match[2]) +
                    parseInt(match[3]) / 1000);
                const text = line.replace(timeRegex, '').trim();

                return { time, text };
            })
            .filter(item => item && item.text); // 过滤掉空行和没有文本的行
    };

    // 获取歌词
    useEffect(() => {
        const fetchLyrics = async () => {
            try {
                const response = await axios.post('/api/lyrics', {
                    songId: songId
                });

                if (response.data.lrc && response.data.lrc.lyric) {
                    const parsedLyrics = parseLyrics(response.data.lrc.lyric);
                    setLyrics(parsedLyrics);
                }
            } catch (error) {
                console.error('获取歌词失败:', error);
            }
        };

        if (songId) {
            fetchLyrics();
        }
    }, [songId]);

    // 根据当前播放时间更新当前歌词
    useEffect(() => {
        const index = lyrics.findIndex((lyric, index) => {
            const nextLyric = lyrics[index + 1];
            return currentTime >= lyric.time &&
                (!nextLyric || currentTime < nextLyric.time);
        });

        if (index !== -1) {
            setCurrentLyricIndex(index);
        }
    }, [currentTime, lyrics]);

    // 处理歌词点击事件
    const handleLyricClick = (time) => {
        if (onSeek) {
            console.log("onSeek:", time);
            onSeek(time);
        }
    };

    return (
        <div className="h-48 overflow-y-auto px-4 py-2">
            <div className="space-y-2">
                {lyrics.map((lyric, index) => (
                    <div
                        key={index}
                        className={`transition-all duration-300 cursor-pointer hover:text-blue-400 ${index === currentLyricIndex
                            ? 'text-blue-600 font-bold text-lg'
                            : 'text-gray-600 text-base'
                            }`}
                        onClick={() => handleLyricClick(lyric.time)}
                    >
                        {lyric.text}
                    </div>
                ))}
            </div>
        </div>
    );
}