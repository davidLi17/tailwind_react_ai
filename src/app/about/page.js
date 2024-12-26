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
        <div>
            <h1>About Page</h1>
            <p>This is the about page.</p>
            <button onClick={handleClick}>Click me</button>
            <p>{message}</p>
        </div>
    );
}
