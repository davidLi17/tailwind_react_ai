'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          欢迎来到我的主页
        </h1>
        <nav className="bg-white rounded-lg shadow-lg p-6">
          <ul className="flex flex-col space-y-4">
            <li>
              <Link
                href="/about"
                className="block text-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md px-4 py-3 transition-colors duration-200"
              >
                关于我们
              </Link>
            </li>
            <li>
              <Link
                href="/musicplay"
                className="block text-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md px-4 py-3 transition-colors duration-200"
              >
                音乐播放
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
