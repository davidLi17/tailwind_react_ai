'use client';
import React, { useState, useRef, useEffect } from 'react';

export default function About() {
    const [message, setMessage] = useState('');

    function handleClick() {
        fetch('/api/hello', {
            method: 'POST',
            body: JSON.stringify({ message: '你刚刚发送了一条请求!!!!!' }),
        })
            .then(response => response.json())
            .then(data => setMessage(data.your_message))
            .catch(error => console.error('Error:', error));
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">关于我们</h1>

                <p className="text-gray-600 mb-8 leading-relaxed">
                    这是一个使用 Next.js 和 React 构建的音乐播放器项目。我们致力于为用户提供最好的音乐体验。
                </p>

                <button
                    onClick={handleClick}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                >
                    发送请求
                </button>

                {message && (
                    <p className="mt-6 p-4 bg-gray-50 rounded-lg text-gray-700">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
