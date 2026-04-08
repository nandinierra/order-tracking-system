import React from 'react';
import { Link } from 'react-router-dom';
import { User, ShoppingBag, Eye } from 'lucide-react';

const STATUS_CONFIG = {
  placed: 'bg-slate-100 text-slate-600',
  packed: 'bg-blue-100 text-blue-600',
  shipped: 'bg-orange-100 text-orange-600',
  delivered: 'bg-emerald-100 text-emerald-600',
};

const OrderCard = ({ order }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order #{order.id}</span>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${STATUS_CONFIG[order.status] || 'bg-slate-100'}`}>
          {order.status}
        </span>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-slate-800">
          <User className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-sm tracking-tight">{order.customer_name}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <ShoppingBag className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium">{order.item}</span>
        </div>
      </div>

      <Link 
        to={`/order/${order.id}`}
        className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-600 transition-colors"
      >
        <Eye className="w-4 h-4" />
        View Status
      </Link>
    </div>
  );
};

export default OrderCard;
