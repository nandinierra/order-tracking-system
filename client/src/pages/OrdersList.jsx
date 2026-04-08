import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../services/api';
import OrderCard from '../components/OrderCard';
import { Search, Filter, LayoutGrid, PackageSearch, Plus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_FILTERS = ['All', 'Placed', 'Packed', 'Shipped', 'Delivered'];

const SkeletonCard = () => (
  <div className="bg-slate-50 rounded-[32px] p-6 h-72 animate-pulse border border-slate-100/50">
    <div className="flex justify-between mb-8">
      <div className="w-20 h-4 bg-slate-200 rounded-full" />
      <div className="w-16 h-6 bg-slate-200 rounded-full" />
    </div>
    <div className="space-y-4 mb-8">
      <div className="flex gap-3">
        <div className="w-8 h-8 bg-slate-200 rounded-xl" />
        <div className="w-32 h-6 bg-slate-200 rounded-md" />
      </div>
      <div className="flex gap-3">
        <div className="w-8 h-8 bg-slate-200 rounded-xl" />
        <div className="w-40 h-6 bg-slate-200 rounded-md" />
      </div>
    </div>
    <div className="w-full h-12 bg-slate-200 rounded-2xl" />
  </div>
);

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'All' || order.status.toLowerCase() === activeFilter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [orders, searchQuery, activeFilter]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-xl shadow-indigo-200 group-hover:rotate-6 transition-transform">
              <LayoutGrid className="text-white w-5 h-5" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Operations Hub</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Orders Registry</h2>
          <p className="text-slate-500 font-bold mt-1">Real-time status tracking for all active shipments</p>
        </div>

        <Link 
          to="/" 
          className="group flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 hover:shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          Create New Shipment
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-10">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-[20px] pl-12 pr-6 py-4 font-bold text-slate-700 outline-hidden focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
          <div className="p-2 bg-slate-50 rounded-2xl mr-2">
            <Filter className="w-4 h-4 text-slate-400" />
          </div>
          {STATUS_FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-3.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === filter 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : filteredOrders.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[48px] border-2 border-dashed border-slate-100 p-24 text-center max-w-2xl mx-auto shadow-2xl shadow-slate-100"
        >
          <div className="bg-slate-50 w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-8 rotate-3">
            <PackageSearch className="w-12 h-12 text-slate-300" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">No shipments found</h3>
          <p className="text-slate-500 font-bold mb-10 leading-relaxed">
            {searchQuery || activeFilter !== 'All' 
              ? "We couldn't find any orders matching your current search or filters. Try clearing them to see all results."
              : "Your registry is currently empty. Start by creating your first shipment order to track its progress here."}
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 bg-indigo-600 text-white px-10 py-5 rounded-3xl font-black text-sm hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/30 hover:-translate-y-1 active:translate-y-0"
          >
            Create Your First Order
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order, idx) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <OrderCard order={order} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default OrdersList;

