import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, Loader2, User, Box, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { createOrder } from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const CreateOrder = ({ setHasUnread }) => {
  const [customer_name, setCustomerName] = useState('');
  const [item, setItem] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customer_name || !item) {
      toast.error('Please fill in all fields', {
        id: 'form-validation',
        style: { borderRadius: '12px', fontWeight: 'bold' }
      });
      return;
    }

    setLoading(true);
    try {
      await createOrder({ customer_name, item });
      
      toast.success('✅ Order Created Successfully!', {
        duration: 4000,
        style: {
          borderRadius: '16px',
          background: '#0f172a',
          color: '#fff',
          padding: '16px',
          fontSize: '14px',
          fontWeight: 'bold'
        },
      });
      
      setIsSuccess(true);
      setCustomerName('');
      setItem('');
      setHasUnread(true); 

      // Auto-redirect after success
      setTimeout(() => navigate('/orders'), 2000);
      
    } catch (error) {
      toast.error('Failed to process shipment request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 bg-[#FDFEFE]">
      <div className="w-full max-w-lg relative">
        {/* Background Decorative Elements */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(79,70,229,0.15)] p-10 md:p-14 border border-slate-100"
        >
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="form-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="text-center mb-12">
                  <div className="w-20 h-20 bg-indigo-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 rotate-3">
                    <PlusCircle className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">New Shipment</h2>
                  <p className="text-slate-500 font-bold mt-2">Initialize a new package for real-time tracking</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Customer Identifier</label>
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                      <input
                        type="text"
                        value={customer_name}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 outline-hidden transition-all font-bold text-slate-800 placeholder-slate-400"
                        placeholder="Customer full name"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Item Specifications</label>
                    <div className="relative group">
                      <Box className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => setItem(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 outline-hidden transition-all font-bold text-slate-800 placeholder-slate-400"
                        placeholder="What are you shipping?"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group w-full relative overflow-hidden bg-slate-900 hover:bg-indigo-600 text-white font-black py-6 rounded-[24px] shadow-2xl shadow-indigo-600/10 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    <div className="relative z-10 flex items-center justify-center gap-3">
                      {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          <span>Initialize Shipment</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>

                  <div className="flex items-center justify-center gap-2 pt-2 opacity-50 grayscale">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Secure Protocol v2.4</span>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-content"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="w-24 h-24 bg-emerald-50 rounded-[32px] flex items-center justify-center border-4 border-emerald-100"
                  >
                    <Sparkles className="w-12 h-12 text-emerald-600" />
                  </motion.div>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg"
                  >
                    <ShieldCheck className="w-5 h-5" />
                  </motion.div>
                </div>
                
                <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Shipment Secured!</h3>
                <p className="text-slate-500 font-bold mb-10">
                  Your order has been logged in our registry and is ready for tracking.
                </p>

                <div className="inline-flex flex-col items-center gap-4">
                  <p className="text-[11px] font-black uppercase tracking-widest text-indigo-500 animate-pulse">Redirecting to dashboard...</p>
                  <Link 
                    to="/orders" 
                    className="flex items-center gap-2 text-slate-900 font-black text-sm border-b-2 border-slate-900 pb-1 hover:text-indigo-600 hover:border-indigo-600 transition-all"
                  >
                    Go there now
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateOrder;

