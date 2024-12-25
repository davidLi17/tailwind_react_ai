import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <nav>
        <ul>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/musicplay">Contact</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
