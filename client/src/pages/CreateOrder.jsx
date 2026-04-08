import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Loader2, User, Box } from 'lucide-react';
import { createOrder } from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const CreateOrder = ({ setHasUnread }) => {
  const [customer_name, setCustomerName] = useState('');
  const [item, setItem] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customer_name || !item) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await createOrder({ customer_name, item });
      toast.success('✅ Order Added Successfully', {
        style: {
          borderRadius: '12px',
          background: '#333',
          color: '#fff',
          fontWeight: 'bold'
        },
      });
      setCustomerName('');
      setItem('');
      setHasUnread(true); // Trigger the blue dot
    } catch (error) {
      toast.error('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[32px] shadow-2xl shadow-indigo-100 p-10 border border-slate-50"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PlusCircle className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Create New Order</h2>
          <p className="text-slate-400 text-sm mt-2 font-medium">Add a new shipment to the tracking system</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Customer Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                value={customer_name}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-slate-800 placeholder-slate-300"
                placeholder="Ex. Nandini"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Order Item</label>
            <div className="relative group">
              <Box className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-slate-800 placeholder-slate-300"
                placeholder="Ex. Macbook Pro M3"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-600/30 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Create Order'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateOrder;
