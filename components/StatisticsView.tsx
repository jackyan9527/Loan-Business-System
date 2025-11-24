import React from 'react';
import { Statistics } from '../types';
import { TrendingUp, PieChart, Wallet } from 'lucide-react';

interface Props {
  stats: Statistics;
}

export const StatisticsView: React.FC<Props> = ({ stats }) => {
  return (
    <div className="space-y-4">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-primary to-blue-600 rounded-xl p-4 text-white shadow-lg">
           <div className="flex items-center justify-between mb-2">
              <span className="text-xs opacity-80">累计放款金额</span>
              <Wallet size={16} className="opacity-80" />
           </div>
           <div className="text-2xl font-bold">{stats.totalAmount}</div>
           <div className="text-xs mt-1 opacity-70">较上月 +12%</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
           <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">本月通过率</span>
              <PieChart size={16} className="text-success" />
           </div>
           <div className="text-2xl font-bold text-gray-800">{stats.approvalRate}%</div>
           <div className="text-xs mt-1 text-success">高于平均水平</div>
        </div>
      </div>

      {/* Funnel Chart */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center">
            <TrendingUp size={16} className="text-primary mr-2" /> 业务漏斗
        </h3>
        <div className="flex flex-col gap-2">
           {stats.funnel.map((item, index) => {
               const width = `${100 - (index * 15)}%`;
               return (
                   <div key={item.stage} className="flex items-center justify-center relative h-8" style={{ width: '100%' }}>
                       <div 
                         className={`absolute top-0 bottom-0 rounded-lg ${item.color} opacity-90`} 
                         style={{ width: width, left: '50%', transform: 'translateX(-50%)' }}
                       ></div>
                       <span className="relative z-10 text-xs font-medium text-white flex justify-between w-full max-w-[150px] px-2">
                          <span>{item.stage}</span>
                          <span>{item.count}</span>
                       </span>
                   </div>
               )
           })}
        </div>
      </div>

      {/* Trend Chart (Simple CSS Bar Chart) */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-bold text-gray-800 mb-4">近30日趋势</h3>
        <div className="h-40 flex items-end justify-between px-2 gap-2">
           {stats.trend.map((day) => {
               const height = `${(day.value / 40) * 100}%`; // Mock scaling
               return (
                   <div key={day.date} className="flex flex-col items-center flex-1">
                       <div 
                         className="w-full bg-blue-100 hover:bg-primary rounded-t transition-colors relative group" 
                         style={{ height: height }}
                       >
                           {/* Tooltip */}
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                               {day.value}
                           </div>
                       </div>
                       <span className="text-[10px] text-gray-400 mt-2 transform -rotate-45 origin-top-left translate-y-2">{day.date}</span>
                   </div>
               )
           })}
        </div>
      </div>
    </div>
  );
};
