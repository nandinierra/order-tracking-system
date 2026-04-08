import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, ClipboardList, PlusCircle, Globe } from 'lucide-react';

const Navbar = ({ hasUnread, setHasUnread }) => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100/50 py-5 px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative bg-indigo-600 p-2.5 rounded-xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-indigo-600/20">
              <Package className="text-white w-5 h-5" />
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <h1 className="text-xl font-black tracking-tighter text-slate-900">
              SHIP<span className="text-indigo-600">STATION</span>
            </h1>
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">Global Tracker</span>
          </div>
        </Link>

        {/* Right: Navigation */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link 
            to="/" 
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              location.pathname === '/' 
              ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">New Dispatch</span>
          </Link>

          <Link 
            to="/orders" 
            onClick={() => setHasUnread(false)}
            className={`relative flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              location.pathname === '/orders' 
              ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span className="hidden sm:inline">Registry</span>
            
            {hasUnread && location.pathname !== '/orders' && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white"></span>
              </span>
            )}
          </Link>

          <div className="h-8 w-[1px] bg-slate-100 mx-2 hidden md:block" />
          
          <button className="hidden md:flex items-center gap-2 p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-all">
            <Globe className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

