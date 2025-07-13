'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-primary text-text border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">MyWebsite</h1>
        <nav className="space-x-6">
          <Link href="/" className="hover:underline ">Home</Link>
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/services" className="hover:underline">Services</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
          <Link href="/profile" className="hover:underline">Profile</Link>
        </nav>
      </div>
    </header>
  );
}
