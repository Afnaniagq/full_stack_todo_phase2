'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isAuthenticated } from '../utils/auth';

export default function Layout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  // This ensures the check only happens on the client side
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, [pathname]);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Profile', href: '/profile' },
    { name: 'Trash', href: '/trash' },
  ];

  const publicNavigation = [
    { name: 'Home', href: '/' },
    { name: 'Login', href: '/login' },
  ];

  return (
    <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
      <nav className="bg-indigo-600">
        <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl">
          <Link href="/" className="text-xl font-bold text-white">TodoApp</Link>
          <div className="flex space-x-4">
            {(isLoggedIn ? navigation : publicNavigation).map((item) => (
              <Link key={item.name} href={item.href} className="px-3 py-2 text-sm font-medium text-white hover:text-indigo-200">
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}