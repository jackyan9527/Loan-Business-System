import React from 'react';
import { UserRole } from '../types';
import { User, Settings, HelpCircle, LogOut, ChevronRight, Shield } from 'lucide-react';

interface Props {
  currentRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
}

const ROLES: { value: UserRole; label: string; desc: string; color: string }[] = [
  { value: 'INITIATOR', label: '订单发起人', desc: '负责录入客户信息，上传资料', color: 'bg-blue-600' },
  { value: 'DELIVERY', label: '交付人员', desc: '负责初审额度，匹配产品', color: 'bg-purple-600' },
  { value: 'MANAGER', label: '管理人员', desc: '负责审批方案，终审确认', color: 'bg-orange-600' },
];

export const ProfileView: React.FC<Props> = ({ currentRole, onSwitchRole }) => {
  return (
    <div className="space-y-4">
      {/* User Header */}
      <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-2 border-primary">
            <User size={32} className="text-primary" />
        </div>
        <div>
            <h2 className="text-lg font-bold text-gray-800">张经理</h2>
            <p className="text-xs text-gray-500">工号: A88321 • 华南大区</p>
            <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-primary text-xs font-medium">
                <Shield size={10} className="mr-1" />
                {ROLES.find(r => r.value === currentRole)?.label}
            </div>
        </div>
      </div>

      {/* Role Switcher Section */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
         <div className="p-3 border-b border-gray-100">
             <h3 className="text-sm font-bold text-gray-800">切换身份 (演示功能)</h3>
         </div>
         <div className="p-3 grid gap-2">
             {ROLES.map(role => (
                 <button
                    key={role.value}
                    onClick={() => onSwitchRole(role.value)}
                    className={`flex items-center p-3 rounded-lg border text-left transition-all ${
                        currentRole === role.value 
                        ? 'border-primary bg-blue-50' 
                        : 'border-gray-100 hover:bg-gray-50'
                    }`}
                 >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white mr-3 ${role.color}`}>
                        <User size={16} />
                    </div>
                    <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800">{role.label}</div>
                        <div className="text-xs text-gray-500">{role.desc}</div>
                    </div>
                    {currentRole === role.value && (
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                    )}
                 </button>
             ))}
         </div>
      </div>

      {/* Menu Links */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <MenuLink icon={<Settings size={18} />} label="系统设置" />
          <MenuLink icon={<HelpCircle size={18} />} label="帮助与反馈" />
          <div className="h-px bg-gray-100 mx-3"></div>
          <button className="w-full flex items-center justify-between p-4 text-sm text-danger hover:bg-red-50 transition-colors">
              <div className="flex items-center">
                  <LogOut size={18} className="mr-3" />
                  <span>退出登录</span>
              </div>
          </button>
      </div>
    </div>
  );
};

const MenuLink = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <button className="w-full flex items-center justify-between p-4 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
        <div className="flex items-center">
            <span className="text-gray-400 mr-3">{icon}</span>
            <span>{label}</span>
        </div>
        <ChevronRight size={16} className="text-gray-300" />
    </button>
);
