'use client';
import React from 'react';
import MusicPlayer from './musicplayer'; // 确保路径正确

function App() {
    // 示例函数，处理下一首歌曲
    const handleNext = () => {
        console.log("Playing next song");
        // 这里可以添加逻辑来切换到下一首歌曲
    };

    // 示例函数，处理上一首歌曲
    const handlePrevious = () => {
        console.log("Playing previous song");
        // 这里可以添加逻辑来切换到上一首歌曲
    };

    return (
        <div className="App">
            <h1>My Music Player</h1>
            <MusicPlayer
                src="http://music.163.com/song/media/outer/url?id=447925558.mp3"
                onNext={handleNext}
                onPrevious={handlePrevious}
            />
        </div>
    );
}

export default App;
