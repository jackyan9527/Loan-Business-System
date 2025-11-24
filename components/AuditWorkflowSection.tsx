import React, { useState, useEffect } from 'react';
import { UserRole, Order, AuditData } from '../types';
import { Lock, CheckCircle, Share2, FileText, UserCheck, ArrowRight } from 'lucide-react';

interface Props {
  role: UserRole;
  order: Order;
  onUpdateAudit: (orderId: string, data: AuditData, nextStatus: Order['status']) => void;
  onShare: () => void; // New prop to trigger sharing
}

export const AuditWorkflowSection: React.FC<Props> = ({ role, order, onUpdateAudit, onShare }) => {
  const [limitInput, setLimitInput] = useState(order.auditData?.limit || '');
  const [productInput, setProductInput] = useState(order.auditData?.product || '');

  // Update local state when order changes
  useEffect(() => {
    setLimitInput(order.auditData?.limit || '');
    setProductInput(order.auditData?.product || '');
  }, [order]);

  const handleSubmitToManager = () => {
    if (!limitInput || !productInput) {
      alert('请填写额度和产品信息');
      return;
    }
    onUpdateAudit(order.id, {
      limit: limitInput,
      product: productInput,
      submittedAt: new Date().toLocaleString()
    }, 'PENDING_APPROVAL');
  };

  const handleManagerApprove = () => {
    if (!order.auditData) return;
    onUpdateAudit(order.id, {
      ...order.auditData,
      approvedAt: new Date().toLocaleString()
    }, 'AUDIT_COMPLETE');
  };

  const handleManagerReject = () => {
    if(confirm('确定要驳回给交付人员重新出方案吗？')) {
        onUpdateAudit(order.id, {
            limit: limitInput,
            product: productInput,
        }, 'PENDING_AUDIT');
    }
  };

  // --- RENDER LOGIC BASED ON ROLES & STATUS ---

  // 1. PENDING_UPLOAD: Workflow hasn't started yet
  if (order.status === 'PENDING_UPLOAD') {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 text-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
            <Lock size={20} />
          </div>
          <div className="space-y-1">
             <p className="text-sm text-gray-600 font-medium">初审方案未开启</p>
             <p className="text-xs-compact text-gray-400">请发起人完善资料后，分享给交付人员出具方案</p>
          </div>
          
          {/* Action for Initiator */}
          {role === 'INITIATOR' && (
             <button 
               onClick={onShare}
               className="mt-2 bg-primary text-white text-xs-compact px-4 py-2 rounded-lg flex items-center shadow-sm hover:bg-blue-600 transition-colors"
             >
               <Share2 size={14} className="mr-1.5" /> 分享给交付出方案
             </button>
          )}
        </div>
      </div>
    );
  }

  // 2. Delivery View: Input Form
  if (role === 'DELIVERY') {
    if (order.status === 'PENDING_AUDIT') {
      return (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <h4 className="text-sm font-medium text-primary mb-2 flex items-center">
             <FileText className="w-4 h-4 mr-1.5" /> 交付人员操作区
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs-compact text-gray-500 mb-1 block">初审预估额度</label>
              <input 
                type="text" 
                value={limitInput}
                onChange={(e) => setLimitInput(e.target.value)}
                placeholder="例：500万"
                className="w-full text-sm border border-blue-200 rounded px-2 py-1.5 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs-compact text-gray-500 mb-1 block">匹配产品</label>
              <input 
                type="text" 
                value={productInput}
                onChange={(e) => setProductInput(e.target.value)}
                placeholder="例：工行经营贷"
                className="w-full text-sm border border-blue-200 rounded px-2 py-1.5 focus:outline-none focus:border-primary"
              />
            </div>
            <button 
              onClick={handleSubmitToManager}
              className="w-full bg-primary text-white text-xs-compact py-2 rounded shadow-sm hover:bg-blue-600 active:scale-95 transition-all flex items-center justify-center"
            >
              提交给管理员确认 <ArrowRight size={12} className="ml-1" />
            </button>
          </div>
        </div>
      );
    }
    if (order.status === 'PENDING_APPROVAL' || order.status === 'AUDIT_COMPLETE') {
       return (
        <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex flex-col items-center justify-center text-green-700">
           <CheckCircle className="w-8 h-8 mb-2 opacity-50" />
           <p className="text-sm font-medium">方案已提交</p>
           <p className="text-xs-compact text-green-600 mt-1">当前状态: {order.status === 'AUDIT_COMPLETE' ? '审核通过' : '等待管理员审核'}</p>
        </div>
       )
    }
  }

  // 3. Manager View: Approval
  if (role === 'MANAGER') {
    if (order.status === 'PENDING_APPROVAL') {
      return (
        <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
           <h4 className="text-sm font-medium text-warning mb-2 flex items-center">
             <UserCheck className="w-4 h-4 mr-1.5" /> 管理员审核区
          </h4>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-white p-2 rounded border border-orange-200">
              <span className="text-xs-compact text-gray-400 block">提交额度</span>
              <span className="text-sm font-bold text-gray-800">{order.auditData?.limit}</span>
            </div>
            <div className="bg-white p-2 rounded border border-orange-200">
              <span className="text-xs-compact text-gray-400 block">匹配产品</span>
              <span className="text-sm font-bold text-gray-800">{order.auditData?.product}</span>
            </div>
          </div>
          <div className="flex gap-2">
             <button 
              onClick={handleManagerReject}
              className="flex-1 bg-white border border-danger text-danger text-xs-compact py-2 rounded hover:bg-red-50"
            >
              驳回修改
            </button>
            <button 
              onClick={handleManagerApprove}
              className="flex-1 bg-primary text-white text-xs-compact py-2 rounded shadow-sm hover:bg-blue-600"
            >
              确认通过 (同步给发起人)
            </button>
          </div>
        </div>
      );
    }
    // For manager, seeing PENDING_AUDIT means waiting for delivery
    if (order.status === 'PENDING_AUDIT') {
         return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
           <p className="text-xs-compact text-gray-500">等待交付人员提交初步方案...</p>
        </div>
      );
    }
    if (order.status === 'AUDIT_COMPLETE') {
        return (
         <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex flex-col items-center justify-center text-green-700">
            <CheckCircle className="w-5 h-5 mb-1" />
            <p className="text-xs-compact">您已审核通过此方案</p>
         </div>
        )
     }
  }

  // 4. Initiator View (and default view for others when complete)
  if (order.status === 'AUDIT_COMPLETE') {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10">
            <FileText size={64} />
        </div>
        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
            <CheckCircle className="w-4 h-4 text-success mr-1.5" /> 初审方案 (已确认)
        </h4>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <span className="text-xs-compact text-gray-500 block mb-1">初审额度</span>
                <span className="text-xl font-bold text-primary">{order.auditData?.limit}</span>
            </div>
            <div>
                <span className="text-xs-compact text-gray-500 block mb-1">推荐产品</span>
                <span className="text-base font-medium text-gray-800">{order.auditData?.product}</span>
            </div>
        </div>
        <div className="mt-3 pt-2 border-t border-blue-100 text-xs-compact text-gray-500">
            审核时间: {order.auditData?.approvedAt}
        </div>
      </div>
    );
  } else if (order.status === 'PENDING_APPROVAL') {
     return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
             <div className="flex justify-center mb-2">
                <div className="animate-pulse bg-orange-100 p-2 rounded-full">
                    <UserCheck size={20} className="text-warning" />
                </div>
             </div>
            <p className="text-sm font-medium text-gray-700">方案待审核</p>
            <p className="text-xs-compact text-gray-500 mt-1">交付人员已提交，正在等待管理员确认...</p>
        </div>
     )
  } else if (order.status === 'PENDING_AUDIT') {
    return (
       <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
           <div className="flex justify-center mb-2">
                <div className="bg-blue-50 p-2 rounded-full">
                    <FileText size={20} className="text-primary" />
                </div>
           </div>
           <p className="text-sm font-medium text-gray-700">交付人员处理中</p>
           <p className="text-xs-compact text-gray-500 mt-1">已分享给交付人员，等待出具方案...</p>
       </div>
    )
 }

  // Fallback
  return null;
};