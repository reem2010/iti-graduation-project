'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-primary text-text border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">MyWebsite</h1>
        <nav className="space-x-6">
        <Link href="/" className="hover:underline">الرئيسية</Link>
          <Link href="/doctor" className="hover:underline">الأطباء</Link>
          <Link href="/auth" className="hover:underline">تسجيل الدخول</Link>
        </nav>
      </div>
    </header>
  );
}
