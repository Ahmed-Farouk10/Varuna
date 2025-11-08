import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Ensure sidebar starts closed on mount (Safari fix)
  useEffect(() => {
    setSidebarOpen(false);
    // Force close on mount for Safari
    const timer = setTimeout(() => {
      setSidebarOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Prevent body scroll when sidebar is open on mobile (Safari-compatible)
  useEffect(() => {
    if (sidebarOpen) {
      // Save current scroll position for Safari
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      // Prevent iOS Safari bounce
      document.body.style.touchAction = 'none';
    } else {
      // Restore scroll position for Safari
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [sidebarOpen]);

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const navigation = [
    { name: 'Dashboard', href: '/home', icon: HomeIcon },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSidebarOpen(false);
          }}
          style={{ 
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none'
          }}
        />
      )}

      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          ...(sidebarOpen ? { 
            pointerEvents: 'auto',
            visibility: 'visible'
          } : { 
            pointerEvents: 'none',
            visibility: 'hidden'
          })
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 bg-white">
          <h1 className="text-xl font-bold text-[#A49FFF] font-cool">Varuna</h1>
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSidebarOpen(false);
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSidebarOpen(false);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="text-gray-700 hover:text-gray-900 active:bg-gray-100 p-3 rounded-lg transition-colors touch-manipulation"
            style={{ 
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              WebkitTouchCallout: 'none',
              cursor: 'pointer',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitAppearance: 'none'
            }}
            aria-label="Close menu"
          >
            <XMarkIcon className="h-7 w-7 pointer-events-none" />
          </button>
        </div>
        <nav className="mt-4 px-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(false);
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                setSidebarOpen(false);
              }}
              className={`flex items-center px-3 py-3 text-base font-medium rounded-lg mb-1 active:bg-purple-100 ${
                location.pathname === item.href
                  ? 'bg-purple-100 text-[#A49FFF] border-l-4 border-[#A49FFF]'
                  : 'text-gray-700 hover:bg-purple-50'
              }`}
              style={{ 
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              <item.icon className="mr-3 h-6 w-6" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:z-30">
        <div className="flex flex-col flex-1 bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-[#A49FFF] font-cool">Varuna</h1>
          </div>
          <nav className="flex-1 px-2 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 ${
                  location.pathname === item.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className={`sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b-2 border-purple-200/50 shadow-md ${sidebarOpen ? 'lg:z-20' : ''}`}>
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 active:text-gray-900 lg:hidden p-2 -ml-2 rounded-lg active:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSidebarOpen(true);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSidebarOpen(true);
              }}
              style={{ 
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                cursor: 'pointer'
              }}
              aria-label="Open menu"
            >
              <Bars3Icon className="h-7 w-7" />
            </button>
            <div className="flex-1 lg:ml-0">
              <h2 className="text-lg font-semibold text-gray-900 font-cool">
                {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center">
              <button className="rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none">
                <UserCircleIcon className="h-8 w-8" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="py-3 sm:py-4 lg:py-6 px-3 sm:px-4 lg:px-6 xl:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
