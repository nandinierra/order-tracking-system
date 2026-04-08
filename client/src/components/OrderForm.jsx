import React, { useState } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';
import { createOrder } from '../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const OrderForm = ({ onOrderCreated }) => {
  const [customer_name, setCustomerName] = useState('');
  const [item, setItem] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customer_name || !item) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const newOrder = await createOrder({ customer_name, item });
      toast.success('Order created successfully!');
      setCustomerName('');
      setItem('');
      onOrderCreated(newOrder);
    } catch (error) {
      toast.error('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 max-w-lg mx-auto mb-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <PlusCircle className="text-indigo-600 w-6 h-6" />
        <h2 className="text-2xl font-bold text-slate-800">New Order</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Customer Name</label>
          <input
            type="text"
            value={customer_name}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Order Item</label>
          <input
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none"
            placeholder="MacBook Pro M3"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Order'}
        </button>
      </form>
    </motion.div>
  );
};

export default OrderForm;
