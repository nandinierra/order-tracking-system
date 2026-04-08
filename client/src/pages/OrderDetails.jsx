
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrders, updateOrderStatus } from '../services/api';
import Timeline from '../components/Timeline';
import { ArrowLeft, User, Package, Calendar, ChevronRight, PartyPopper, Copy, Check, Clock, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const NEXT_STAGE_LABELS = {
  placed: 'Process Order',
  packed: 'Dispatch Shipment',
  shipped: 'Confirm Delivery',
};

const STATUS_BADGE = {
  placed: 'bg-slate-100 text-slate-600 border-slate-200',
  packed: 'bg-blue-50 text-blue-600 border-blue-100',
  shipped: 'bg-orange-50 text-orange-600 border-orange-100',
  delivered: 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-lg shadow-emerald-100/50',
};

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchOrderDetails = useCallback(async () => {
    setLoading(true);
    try {
      const allOrders = await getOrders();
      const found = allOrders.find(o => o.id === parseInt(id));
      setOrder(found);
    } catch (err) {
      toast.error('Failed to load order info');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const handleCopy = () => {
    navigator.clipboard.writeText(order.id.toString());
    setCopied(true);
    toast.success('Order ID copied!', {
      style: {
        borderRadius: '12px',
        background: '#1e293b',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold',
      },
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdate = async () => {
    if (!order || order.status === 'delivered') return;
    setUpdating(true);
    try {
      const updated = await updateOrderStatus(order.id);
      setOrder(updated);

      if (updated.status === 'delivered') {
        toast.success(` Order delivered successfully!`, {
          duration: 5000,
          icon: ''
        });
      } else {
        toast.success(` Status updated to ${updated.status}`, {
          icon: ''
        });
      }
    } catch (err) {
      toast.error('Failed to update stage');
    } finally {
      setUpdating(false);
    }
  };

  const formatFullDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace('at ', ''); // Removing potential "at" if it exists in some locales
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        <Package className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600 w-6 h-6" />
      </div>
      <p className="mt-4 text-slate-400 font-bold animate-pulse">Retrieving order details...</p>
    </div>
  );

  if (!order) return (
    <div className="text-center py-32">
      <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <Package className="w-10 h-10 text-slate-200" />
      </div>
      <h3 className="text-3xl font-black text-slate-800 mb-2">Order not found</h3>
      <p className="text-slate-400 font-bold mb-8">The tracking reference you requested does not exist.</p>
      <Link to="/orders" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20">
        Back to status list
      </Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link to="/orders" className="inline-flex items-center gap-2 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-indigo-600 transition-colors mb-10 group">
        <div className="bg-white p-2 rounded-xl border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        </div>
        Back to registry
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[40px] shadow-2xl shadow-indigo-100/50 border border-slate-100 overflow-hidden"
      >
        {/* Top Section */}
        <div className="p-8 md:p-12 border-b border-slate-50 relative">
          <div className="absolute top-0 right-0 p-8">
             <div className={`flex items-center gap-2 px-5 py-2 rounded-full border text-[11px] font-black uppercase tracking-widest ${STATUS_BADGE[order.status]}`}>
              <div className={`w-2 h-2 rounded-full ${order.status === 'delivered' ? 'bg-emerald-500 animate-pulse' : 'bg-current'}`} />
              {order.status}
            </div>
          </div>

          <div className="mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-2 block">Reference ID</span>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 block truncate">#{order.id}</h1>
              <button 
                onClick={handleCopy}
                className="p-2.5 bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all active:scale-90"
                title="Copy Reference"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50/50 p-6 rounded-[32px] border border-slate-100/50 group hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-500">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center mb-4 border border-slate-100 group-hover:border-indigo-100 transition-colors">
                <User className="w-5 h-5 text-indigo-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Customer</p>
              <p className="font-bold text-slate-800 text-lg">{order.customer_name}</p>
            </div>
            
            <div className="bg-slate-50/50 p-6 rounded-[32px] border border-slate-100/50 group hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-500">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center mb-4 border border-slate-100 group-hover:border-indigo-100 transition-colors">
                <Package className="w-5 h-5 text-indigo-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Items</p>
              <p className="font-bold text-slate-800 text-lg truncate">{order.item}</p>
            </div>

            <div className="bg-slate-50/50 p-6 rounded-[32px] border border-slate-100/50 group hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-500">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center mb-4 border border-slate-100 group-hover:border-indigo-100 transition-colors">
                <Clock className="w-5 h-5 text-indigo-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Created</p>
              <p className="font-bold text-slate-800 text-lg">{formatFullDate(order.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Middle Section: Timeline */}
        <div className="p-8 md:p-12 bg-indigo-50/30">
          <div className="flex items-center justify-center gap-2 mb-8">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Live Shipment Journey</span>
          </div>
          <Timeline currentStatus={order.status} />
        </div>

        {/* Bottom Section: Action */}
        <div className="p-8 md:p-12 flex flex-col items-center bg-white">
          <AnimatePresence mode="wait">
            {order.status !== 'delivered' ? (
              <motion.button
                key="update-btn"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handleUpdate}
                disabled={updating}
                className="group flex items-center gap-4 bg-slate-900 hover:bg-indigo-600 text-white px-12 py-6 rounded-[24px] font-black shadow-2xl shadow-slate-900/10 hover:shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
              >
                {updating ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <div className="bg-white/10 p-1 rounded-lg group-hover:bg-white/20 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
                <span className="text-lg tracking-tight">{NEXT_STAGE_LABELS[order.status]}</span>
              </motion.button>
            ) : (
              <motion.div 
                key="delivered-state"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="w-24 h-24 bg-emerald-100 rounded-[32px] flex items-center justify-center border-4 border-emerald-50"
                  >
                    <PartyPopper className="w-12 h-12 text-emerald-600" />
                  </motion.div>
                  <motion.div 
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-slate-50"
                  >
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  </motion.div>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Shipment Completed</h3>
                  <p className="text-slate-500 font-bold max-w-[300px] leading-relaxed">
                    This package was delivered and the tracking cycle is now closed.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Security/Trust Badge */}
      <div className="mt-12 flex items-center justify-center gap-6 opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all duration-700">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encrypted</span>
        </div>
        <div className="w-1 h-1 bg-slate-300 rounded-full" />
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Real-Time Sync</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

