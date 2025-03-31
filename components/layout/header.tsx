'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SignedIn, SignedOut, UserButton, SignInButton, useClerk } from '@clerk/nextjs';

const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut } = useClerk();

  // ESC 키로 메뉴 닫기
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, []);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const menu = document.getElementById('mobile-menu');
      const button = document.getElementById('menu-button');
      if (menu && button && !menu.contains(e.target as Node) && !button.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: '이미지 생성', href: '/generate' },
    { name: '내 갤러리', href: '/gallery' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="max-w-[1200px] h-full mx-auto px-6 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="h-12">
          <Image
            src="/logo.webp"
            alt="로고"
            width={48}
            height={48}
            className="h-12 w-12"
            priority
          />
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-base font-semibold transition-colors hover:text-blue-600',
                pathname === item.href
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-700'
              )}
            >
              {item.name}
            </Link>
          ))}
          
          {/* 인증 버튼 */}
          <div className="ml-4">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                  로그인
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </nav>

        {/* 모바일 메뉴 버튼 */}
        <button
          id="menu-button"
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="메뉴 열기"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* 모바일 메뉴 */}
        <div
          id="mobile-menu"
          className={cn(
            'fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden',
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex flex-col h-full pt-16">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-6 py-4 text-lg font-semibold transition-colors',
                  pathname === item.href
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* 모바일 인증 버튼 */}
            <div className="px-6 py-4">
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full rounded-md bg-blue-600 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                    로그인
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 