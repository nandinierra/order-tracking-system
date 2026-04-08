import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, ClipboardList, PlusCircle } from 'lucide-react';

const Navbar = ({ hasUnread, setHasUnread }) => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 px-8 mb-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
            <Package className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-800">
            ORDER<span className="text-indigo-600">TRACKER</span>
          </h1>
        </Link>

        {/* Right: Navigation */}
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all ${
              location.pathname === '/' 
              ? 'bg-indigo-50 text-indigo-600' 
              : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span>New Order</span>
          </Link>

          <Link 
            to="/orders" 
            onClick={() => setHasUnread(false)}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all ${
              location.pathname === '/orders' 
              ? 'bg-indigo-50 text-indigo-600' 
              : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            <span>Order Status</span>
            
            {hasUnread && location.pathname !== '/orders' && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white"></span>
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
