import React, { useState, useEffect } from 'react';
import { getOrders } from '../services/api';
import OrderCard from '../components/OrderCard';
import { PackageSearch, RefreshCw, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-100">
            <LayoutGrid className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Orders Status</h2>
            <p className="text-slate-400 font-bold text-sm">Track and manage all shipments in real-time</p>
          </div>
        </div>
        
       
      </div>

      {loading && orders.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-[32px]" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-[48px] border-2 border-dashed border-slate-100 p-20 text-center">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <PackageSearch className="w-12 h-12 text-slate-200" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">No shipments found</h3>
          <p className="text-slate-400 font-medium">Head back to the dashboard to create your first order.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {orders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <OrderCard order={order} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersList;
