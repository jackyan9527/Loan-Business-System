import React, { useState } from 'react';
import { 
  Bell, FileText, Clock, X, Upload,
  Link, LayoutDashboard, Users, Check,
  Home, BarChart, User as UserIcon
} from 'lucide-react';
import { UserRole, Order, AuditData, OrderStatus } from './types';
import { MOCK_ORDERS, MOCK_STATS } from './constants';
import { AuditWorkflowSection } from './components/AuditWorkflowSection';
import { HomeView } from './components/HomeView';
import { OrderListView } from './components/OrderListView';
import { StatisticsView } from './components/StatisticsView';
import { ProfileView } from './components/ProfileView';

type Tab = 'HOME' | 'ORDERS' | 'STATS' | 'PROFILE';

function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('HOME');
  const [currentRole, setCurrentRole] = useState<UserRole>('INITIATOR');
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // --- Actions ---

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedOrder(null);
    document.body.style.overflow = 'auto';
  };

  const handleUpdateAudit = (orderId: string, auditData: AuditData, nextStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          auditData: auditData,
          status: nextStatus,
          statusText: getStatusText(nextStatus)
        };
      }
      return o;
    }));
    
    if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? ({
            ...prev,
            auditData: auditData,
            status: nextStatus,
            statusText: getStatusText(nextStatus)
        }) : null);
    }
  };
  
  const handleShareToDelivery = () => {
    if (!selectedOrder) return;
    const orderId = selectedOrder.id;
    const nextStatus: OrderStatus = 'PENDING_AUDIT';
    
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
         return { ...o, status: nextStatus, statusText: getStatusText(nextStatus) };
      }
      return o;
    }));
    
    setSelectedOrder(prev => prev ? ({ ...prev, status: nextStatus, statusText: getStatusText(nextStatus) }) : null);
    alert('已分享链接给交付人员 (状态变更成功)');
  };

  const getStatusText = (status: OrderStatus) => {
    switch(status) {
        case 'PENDING_UPLOAD': return '待上传资料';
        case 'PENDING_AUDIT': return '进行中：交付审核';
        case 'PENDING_APPROVAL': return '待管理确认';
        case 'AUDIT_COMPLETE': return '初审完成';
        case 'COMPLETED': return '已完成';
        default: return '未知状态';
    }
  };

  // --- Render ---

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-700 flex flex-col">
      {/* Top Header (Visible on all tabs) */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-30 h-14 flex items-center justify-between px-4">
          <h1 className="text-lg font-medium text-gray-700">
             {currentTab === 'HOME' && '贷款业务管理'}
             {currentTab === 'ORDERS' && '全部订单'}
             {currentTab === 'STATS' && '数据统计'}
             {currentTab === 'PROFILE' && '个人中心'}
          </h1>
          <div className="flex items-center gap-3">
             {/* Simple Role Badge if not in Profile */}
             {currentTab !== 'PROFILE' && (
                 <div className={`px-2 py-0.5 rounded text-[10px] text-white font-medium 
                    ${currentRole === 'INITIATOR' ? 'bg-blue-600' : 
                      currentRole === 'DELIVERY' ? 'bg-purple-600' : 'bg-orange-600'}`}>
                    {currentRole === 'INITIATOR' ? '发起人' : currentRole === 'DELIVERY' ? '交付' : '管理员'}
                 </div>
             )}
             <button className="text-gray-500 hover:text-primary relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
          </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-3 pt-16 pb-20 overflow-x-hidden">
         {currentTab === 'HOME' && (
            <HomeView 
                orders={orders} 
                role={currentRole} 
                onOpenDetail={handleOpenDetail} 
            />
         )}
         {currentTab === 'ORDERS' && (
            <OrderListView 
                orders={orders} 
                onOpenDetail={handleOpenDetail} 
            />
         )}
         {currentTab === 'STATS' && (
            <StatisticsView stats={MOCK_STATS} />
         )}
         {currentTab === 'PROFILE' && (
            <ProfileView 
                currentRole={currentRole} 
                onSwitchRole={setCurrentRole} 
            />
         )}
      </main>

      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.08)] z-30 pb-safe">
        <div className="grid grid-cols-4 py-2">
          <NavItem 
            icon={<Home size={22} />} 
            label="首页" 
            active={currentTab === 'HOME'} 
            onClick={() => setCurrentTab('HOME')} 
          />
          <NavItem 
            icon={<FileText size={22} />} 
            label="订单" 
            active={currentTab === 'ORDERS'} 
            onClick={() => setCurrentTab('ORDERS')} 
          />
          <NavItem 
            icon={<BarChart size={22} />} 
            label="统计" 
            active={currentTab === 'STATS'} 
            onClick={() => setCurrentTab('STATS')} 
          />
          <NavItem 
            icon={<UserIcon size={22} />} 
            label="我的" 
            active={currentTab === 'PROFILE'} 
            onClick={() => setCurrentTab('PROFILE')} 
          />
        </div>
      </footer>

      {/* Detail Modal (Global) */}
      {isDetailOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col animate-fade-in">
           <div className="absolute inset-0 flex flex-col bg-white animate-slide-up mt-10 rounded-t-2xl shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-100 flex justify-between items-center rounded-t-2xl">
                <div>
                   <h2 className="text-base font-bold text-gray-800">订单详情</h2>
                   <p className="text-xs text-gray-400">{selectedOrder.id}</p>
                </div>
                <button onClick={handleCloseDetail} className="bg-gray-100 p-1.5 rounded-full text-gray-500 hover:bg-gray-200">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto bg-gray-50">
                 {/* Status Banner */}
                 <div className="bg-white p-4 mb-2">
                    <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                        <Clock className="text-primary mr-2" size={16} /> 流程进度
                    </h3>
                    <Timeline status={selectedOrder.status} />
                 </div>

                 {/* *** AUDIT SECTION (Role-Based Workflow) *** */}
                 <div className="p-4 mb-2 bg-white">
                    <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center justify-between">
                       <span className="flex items-center">
                         <LayoutDashboard className="text-primary mr-2" size={16} /> 
                         初审数据额度
                       </span>
                       <span className="text-[10px] bg-blue-50 text-primary px-2 py-0.5 rounded-full font-medium">核心流程</span>
                    </h3>
                    
                    <AuditWorkflowSection 
                        role={currentRole}
                        order={selectedOrder}
                        onUpdateAudit={handleUpdateAudit}
                        onShare={handleShareToDelivery}
                    />
                 </div>

                 {/* Customer Details Form */}
                 <div className="p-4 mb-2 bg-white">
                   <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                     <Users className="text-primary mr-2" size={16} /> 客户需求信息
                   </h3>
                   <div className="space-y-3">
                      <FormRow label="单位名称" value={selectedOrder.details.companyName} />
                      <FormRow label="成立时间" value={selectedOrder.details.establishDate} />
                      <FormRow label="法人年龄" value={selectedOrder.details.legalPersonAge} />
                      <div className="grid grid-cols-2 gap-3">
                         <FormRow label="婚姻状况" value={selectedOrder.details.maritalStatus} />
                         <FormRow label="企业流水" value={selectedOrder.details.companyFlow} />
                      </div>
                      <FormRow label="个人资产" value={selectedOrder.details.personalAssets} />
                   </div>
                   
                   {/* Water Jellyfish Report Input */}
                   <div className="mt-4 bg-blue-50/50 p-3 rounded-xl flex items-center justify-between border border-blue-100">
                      <div className="flex items-center text-xs font-medium text-gray-700">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-primary mr-2">
                             <Link size={14} />
                          </div>
                          水母报告
                      </div>
                      <div className="flex items-center flex-1 ml-3">
                        <input 
                            type="text" 
                            placeholder="输入报告链接"
                            defaultValue={selectedOrder.details.reportLink || ''}
                            className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-primary bg-white"
                        />
                        <button className="text-primary text-xs font-medium ml-2 whitespace-nowrap px-2 py-1 hover:bg-white rounded">保存</button>
                      </div>
                   </div>
                 </div>

                 {/* Upload Section */}
                 <div className="p-4 mb-20 bg-white">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-medium text-gray-700 flex items-center">
                           <Upload className="text-primary mr-2" size={16} /> 资料上传
                        </h3>
                    </div>

                    <div className="space-y-2">
                        <FileItem name="身份证" status={selectedOrder.files.idCard} />
                        <FileItem name="营业执照" status={selectedOrder.files.businessLicense} />
                        <FileItem name="企业征信" status={selectedOrder.files.companyCredit} />
                    </div>
                 </div>
              </div>
              
              {/* Modal Footer */}
              <div className="p-4 border-t border-gray-100 bg-white absolute bottom-0 left-0 right-0">
                 <button onClick={handleCloseDetail} className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-medium shadow-lg shadow-blue-500/30">
                    保存信息
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

// --- Helper Components ---

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center py-1 transition-colors ${active ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
    {icon}
    <span className="text-[10px] mt-1 font-medium">{label}</span>
  </button>
);

const FormRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col">
    <span className="text-[10px] text-gray-400 mb-1">{label}</span>
    <input type="text" defaultValue={value} className="text-xs text-gray-700 border-b border-gray-200 py-1 focus:outline-none focus:border-primary bg-transparent" />
  </div>
);

const FileItem = ({ name, status }: { name: string; status: boolean }) => (
  <div className="bg-gray-50 p-3 rounded-xl flex items-center justify-between border border-gray-100">
    <div className="flex items-center">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${status ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-500'}`}>
         <FileText size={16} />
      </div>
      <span className="text-xs font-medium text-gray-700">{name}</span>
    </div>
    {status ? (
        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">已上传</span>
    ) : (
        <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-medium">未上传</span>
    )}
  </div>
);

const Timeline = ({ status }: { status: OrderStatus }) => {
    const steps = [
        { key: 'PENDING_UPLOAD', label: '上传' },
        { key: 'PENDING_AUDIT', label: '初审' },
        { key: 'PENDING_APPROVAL', label: '审批' },
        { key: 'AUDIT_COMPLETE', label: '完成' }
    ];

    const getCurrentStepIndex = () => {
        if (status === 'COMPLETED') return 3;
        const idx = steps.findIndex(s => s.key === status);
        return idx === -1 ? 3 : idx;
    };

    const activeIndex = getCurrentStepIndex();

    return (
        <div className="w-full px-2">
            <div className="flex justify-between items-center relative">
                <div className="absolute top-3 left-4 right-4 h-0.5 bg-gray-100 -z-10" />
                <div className="absolute top-3 left-4 h-0.5 bg-primary -z-10 transition-all duration-500" 
                     style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%`, right: 'auto' }} />
                
                {steps.map((step, idx) => {
                    const isActive = idx <= activeIndex;
                    const isCurrent = idx === activeIndex;
                    return (
                        <div key={step.key} className="flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border-2 transition-all
                                ${isActive ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-300'}`}>
                                {isActive ? <Check size={12} /> : idx + 1}
                            </div>
                            <span className={`text-[10px] mt-1.5 font-medium ${isCurrent ? 'text-primary' : 'text-gray-400'}`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default App;
