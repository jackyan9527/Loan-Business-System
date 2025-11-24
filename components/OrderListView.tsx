import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { OrderCard } from './HomeView';

interface Props {
  orders: Order[];
  onOpenDetail: (order: Order) => void;
}

type FilterType = 'ALL' | OrderStatus;

export const OrderListView: React.FC<Props> = ({ orders, onOpenDetail }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.includes(searchTerm) || o.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'ALL' || o.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Search Header */}
      <div className="bg-white p-3 mb-2 shadow-sm rounded-lg">
        <div className="relative w-full">
            <input 
              type="text" 
              placeholder="搜索订单号、客户姓名..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-lg text-sm-compact text-gray-700 border border-gray-200 focus:outline-none focus:border-primary"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto scrollbar-hide mb-3">
        <div className="flex gap-2 min-w-max pb-1 px-1">
           <FilterTab label="全部" active={activeFilter === 'ALL'} onClick={() => setActiveFilter('ALL')} />
           <FilterTab label="待上传" active={activeFilter === 'PENDING_UPLOAD'} onClick={() => setActiveFilter('PENDING_UPLOAD')} />
           <FilterTab label="待初审" active={activeFilter === 'PENDING_AUDIT'} onClick={() => setActiveFilter('PENDING_AUDIT')} />
           <FilterTab label="待审批" active={activeFilter === 'PENDING_APPROVAL'} onClick={() => setActiveFilter('PENDING_APPROVAL')} />
           <FilterTab label="已完成" active={activeFilter === 'COMPLETED'} onClick={() => setActiveFilter('COMPLETED')} />
        </div>
      </div>

      {/* List */}
      <div className="space-y-3 flex-1 overflow-y-auto pb-20">
        {filteredOrders.length > 0 ? (
           filteredOrders.map(order => (
             <OrderCard key={order.id} order={order} onClick={() => onOpenDetail(order)} />
           ))
        ) : (
           <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <Search size={32} className="mb-2 opacity-50" />
              <p className="text-sm">没有找到相关订单</p>
           </div>
        )}
      </div>
    </div>
  );
};

const FilterTab = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs-compact whitespace-nowrap transition-colors ${active ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-500 shadow-sm border border-gray-100'}`}
  >
    {label}
  </button>
);
