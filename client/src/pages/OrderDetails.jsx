
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrders, updateOrderStatus } from '../services/api';
import Timeline from '../components/Timeline';
import { ArrowLeft, User, Package, Calendar, ChevronRight, PartyPopper } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const NEXT_STAGE_LABELS = {
  placed: 'Move to Packed',
  packed: 'Move to Shipped',
  shipped: 'Move to Delivered',
};

const STATUS_BADGE = {
  placed: 'bg-slate-100 text-slate-600',
  packed: 'bg-blue-100 text-blue-600',
  shipped: 'bg-orange-100 text-orange-600',
  delivered: 'bg-emerald-100 text-emerald-600 font-bold border-2 border-emerald-500/20',
};

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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

  const handleUpdate = async () => {
    if (!order || order.status === 'delivered') return;
    setUpdating(true);
    try {
      const updated = await updateOrderStatus(order.id);
      setOrder(updated);
      toast.success(`Success! Order is now ${updated.status}`, { icon: '🚀' });
    } catch (err) {
      toast.error('Failed to update stage');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  if (!order) return (
    <div className="text-center py-20">
      <h3 className="text-2xl font-bold text-slate-400">Order not found</h3>
      <Link to="/orders" className="text-indigo-600 font-bold mt-4 inline-block">Back to orders</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      <Link to="/orders" className="inline-flex items-center gap-2 text-slate-400 font-bold hover:text-slate-800 transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Orders
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[40px] shadow-2xl shadow-indigo-100 border border-slate-50 overflow-hidden"
      >
        {/* Top Section */}
        <div className="p-10 border-b border-slate-50">
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Tracking Reference</span>
              <h1 className="text-4xl font-black text-slate-800 block uppercase">Order ID: #{order.id}</h1>
            </div>
            <span className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest ${STATUS_BADGE[order.status]}`}>
              {order.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-3xl">
              <User className="w-5 h-5 text-indigo-500 mb-2" />
              <p className="text-[10px] font-black uppercase text-slate-400">Customer</p>
              <p className="font-bold text-slate-800">{order.customer_name}</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl">
              <Package className="w-5 h-5 text-indigo-500 mb-2" />
              <p className="text-[10px] font-black uppercase text-slate-400">Package Content</p>
              <p className="font-bold text-slate-800">{order.item}</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl">
              <Calendar className="w-5 h-5 text-indigo-500 mb-2" />
              <p className="text-[10px] font-black uppercase text-slate-400">Created On</p>
              <p className="font-bold text-slate-800">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Middle Section: Timeline */}
        <div className="p-10 bg-indigo-50/20">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 text-center mb-6">Real-Time Delivery Timeline</h3>
          <Timeline currentStatus={order.status} />
        </div>

        {/* Bottom Section: Action */}
        <div className="p-10 flex flex-col items-center">
          {order.status !== 'delivered' ? (
            <button
              onClick={handleUpdate}
              disabled={updating}
              className="group flex items-center gap-4 bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-3xl font-black shadow-2xl shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {updating ? <span className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <ChevronRight className="w-6 h-6" />}
              <span className="text-lg">{NEXT_STAGE_LABELS[order.status]}</span>
            </button>
          ) : (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-4 py-4"
            >
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
                <PartyPopper className="w-10 h-10 text-emerald-500" />
              </div>
              <p className="text-2xl font-black text-emerald-600 tracking-tight text-center">🎉 Order Delivered Successfully</p>
              <p className="text-slate-400 font-medium">This package has reached its final destination.</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OrderDetails;
