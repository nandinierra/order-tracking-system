import React from 'react';
import { Link } from 'react-router-dom';
import { User, ShoppingBag, Eye, Calendar, FileText, Package, Truck, CheckCircle } from 'lucide-react';

const STATUS_CONFIG = {
  placed: { 
    color: 'bg-slate-100 text-slate-600 border-slate-200', 
    icon: FileText,
    label: 'Placed'
  },
  packed: { 
    color: 'bg-blue-50 text-blue-600 border-blue-100', 
    icon: Package,
    label: 'Packed'
  },
  shipped: { 
    color: 'bg-orange-50 text-orange-600 border-orange-100', 
    icon: Truck,
    label: 'Shipped'
  },
  delivered: { 
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100', 
    icon: CheckCircle,
    label: 'Delivered'
  },
};

const OrderCard = ({ order }) => {
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.placed;
  const StatusIcon = status.icon;

  const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="group bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-2 transition-all duration-500">
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference</span>
          <span className="text-sm font-bold text-slate-800">#{order.id}</span>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${status.color}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {status.label}
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
            <User className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Customer</p>
            <p className="font-bold text-slate-800 tracking-tight">{order.customer_name}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
            <ShoppingBag className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Item Details</p>
            <p className="text-sm font-semibold text-slate-600 truncate max-w-[150px]">{order.item}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 pt-2 border-t border-slate-50">
          <Calendar className="w-3.5 h-3.5" />
          {formattedDate}
        </div>
      </div>

      <Link 
        to={`/order/${order.id}`}
        className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-indigo-600 shadow-lg shadow-slate-900/10 hover:shadow-indigo-600/30 transition-all active:scale-95"
      >
        <Eye className="w-4 h-4" />
        Track Order
      </Link>
    </div>
  );
};

export default OrderCard;

