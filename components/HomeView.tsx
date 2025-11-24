import React from 'react';
import { 
  FileText, Clock, ChevronRight, 
  CreditCard, Briefcase, User, Plus, 
  BarChart2, ScanLine, MessageSquare
} from 'lucide-react';
import { Order, UserRole, OrderStatus } from '../types';

interface Props {
  orders: Order[];
  role: UserRole;
  onOpenDetail: (order: Order) => void;
}

export const HomeView: React.FC<Props> = ({ orders, role, onOpenDetail }) => {
  // Filter orders based on what's relevant to the current role
  const getRelevantOrders = () => {
    switch(role) {
      case 'INITIATOR':
        return orders.filter(o => o.status === 'PENDING_UPLOAD' || o.status === 'AUDIT_COMPLETE');
      case 'DELIVERY':
        return orders.filter(o => o.status === 'PENDING_AUDIT');
      case 'MANAGER':
        return orders.filter(o => o.status === 'PENDING_APPROVAL');
      default:
        return orders;
    }
  };

  const activeOrders = getRelevantOrders();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  const getRoleLabel = () => {
    switch(role) {
      case 'INITIATOR': return '业务经理';
      case 'DELIVERY': return '交付专员';
      case 'MANAGER': return '审批管理员';
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Welcome Section */}
      <section className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">
            {getGreeting()}，<span className="text-primary">张三</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">{new Date().toLocaleDateString()} • {getRoleLabel()}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-gray-100 border border-white shadow-sm overflow-hidden">
           <div className="w-full h-full flex items-center justify-center bg-blue-50 text-primary">
             <User size={18} />
           </div>
        </div>
      </section>

      {/* Compact Stats Row */}
      <section className="grid grid-cols-3 gap-3">
        {/* Pending Card (Primary) */}
        <div className="bg-gradient-to-br from-primary to-blue-600 rounded-xl p-3 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
           <div className="relative z-10 flex flex-col h-full justify-between">
              <span className="text-[10px] text-blue-100 font-medium opacity-90">待处理</span>
              <div className="flex items-end justify-between mt-1">
                 <span className="text-2xl font-bold leading-none">{activeOrders.length}</span>
                 <div className="bg-white/20 p-1 rounded-md backdrop-blur-sm">
                    <Clock size={12} className="text-white" />
                 </div>
              </div>
           </div>
        </div>

        {/* Today Added */}
        <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] text-gray-400 font-medium">今日新增</span>
            <div className="flex items-end justify-between mt-1">
                 <span className="text-2xl font-bold text-gray-800 leading-none">3</span>
                 <div className="bg-gray-50 p-1 rounded-md">
                    <Plus size={12} className="text-gray-400" />
                 </div>
            </div>
        </div>

        {/* Month Completed */}
        <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] text-gray-400 font-medium">本月完成</span>
            <div className="flex items-end justify-between mt-1">
                 <span className="text-2xl font-bold text-success leading-none">12</span>
                 <div className="bg-green-50 p-1 rounded-md">
                    <FileText size={12} className="text-success" />
                 </div>
            </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="grid grid-cols-4 gap-3">
          <QuickActionBtn icon={<Plus size={18} />} label="新建" color="bg-blue-50 text-blue-600" />
          <QuickActionBtn icon={<ScanLine size={18} />} label="扫码" color="bg-purple-50 text-purple-600" />
          <QuickActionBtn icon={<BarChart2 size={18} />} label="报表" color="bg-orange-50 text-orange-600" />
          <QuickActionBtn icon={<MessageSquare size={18} />} label="消息" color="bg-green-50 text-green-600" />
        </div>
      </section>

      {/* Task List Header */}
      <section className="pt-2">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-bold text-gray-800 flex items-center">
            <span className="w-1 h-4 bg-primary rounded-full mr-2"></span>
            {role === 'INITIATOR' && '进行中订单'}
            {role === 'DELIVERY' && '待初审订单'}
            {role === 'MANAGER' && '待审批订单'}
          </h3>
          <button className="text-xs text-gray-400 flex items-center hover:text-primary">
             全部 <ChevronRight size={12} />
          </button>
        </div>

        {/* Order List */}
        <div className="space-y-3 pb-4">
          {activeOrders.length > 0 ? (
            activeOrders.map(order => (
              <OrderCard key={order.id} order={order} onClick={() => onOpenDetail(order)} />
            ))
          ) : (
            <div className="bg-white rounded-xl p-6 text-center border border-dashed border-gray-200 mt-2">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2">
                 <FileText size={20} className="text-gray-300" />
              </div>
              <p className="text-xs text-gray-400">暂时没有待处理的任务</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// --- Sub Components ---

const QuickActionBtn = ({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) => (
  <button className="flex flex-col items-center justify-center gap-1.5 p-2 bg-white rounded-xl border border-gray-100 shadow-sm active:scale-95 transition-transform">
    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <span className="text-[10px] font-medium text-gray-600">{label}</span>
  </button>
);

interface OrderCardProps {
  order: Order;
  onClick: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  const getStatusColor = (status: OrderStatus) => {
    switch(status) {
        case 'PENDING_UPLOAD': return { bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-200', accent: 'bg-gray-400' };
        case 'PENDING_AUDIT': return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', accent: 'bg-blue-500' };
        case 'PENDING_APPROVAL': return { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', accent: 'bg-orange-500' };
        case 'AUDIT_COMPLETE': return { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100', accent: 'bg-green-500' };
        case 'COMPLETED': return { bg: 'bg-gray-50', text: 'text-gray-400', border: 'border-gray-100', accent: 'bg-gray-300' };
        default: return { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-100', accent: 'bg-gray-300' };
    }
  };

  const s = getStatusColor(order.status);

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl p-0 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md transition-all cursor-pointer border border-gray-100 relative overflow-hidden group"
    >
      <div className="p-3">
        {/* Header */}
        <div className="flex justify-between items-start mb-2.5">
          <div className="flex items-center gap-2">
             <span className="text-sm font-bold text-gray-800">{order.customerName}</span>
             <span className={`text-[10px] px-1.5 py-0.5 rounded border ${s.border} ${s.bg} ${s.text}`}>
                {order.source}
             </span>
          </div>
          <div className={`text-[10px] font-medium ${s.text} flex items-center`}>
             <span className={`w-1.5 h-1.5 rounded-full mr-1 ${s.accent}`}></span>
             {order.statusText}
          </div>
        </div>
        
        {/* Compact Grid Info */}
        <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="flex items-center">
                <span className="text-[10px] text-gray-400 mr-1.5">金额</span>
                <span className="text-xs font-semibold text-gray-700">{order.amount}</span>
            </div>
            <div className="flex items-center">
                <span className="text-[10px] text-gray-400 mr-1.5">类型</span>
                <span className="text-xs font-semibold text-gray-700">{order.type}</span>
            </div>
            <div className="flex items-center">
                <span className="text-[10px] text-gray-400 mr-1.5">渠道</span>
                <span className="text-xs font-semibold text-gray-700">{order.channel}</span>
            </div>
            <div className="flex items-center">
                <span className="text-[10px] text-gray-400 mr-1.5">单号</span>
                <span className="text-[10px] text-gray-500 font-mono">{order.id.slice(-6)}</span>
            </div>
        </div>
      </div>
    </div>
  );
};