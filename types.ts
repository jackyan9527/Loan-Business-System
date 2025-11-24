export type UserRole = 'INITIATOR' | 'DELIVERY' | 'MANAGER';

export type OrderStatus = 
  | 'PENDING_UPLOAD'   // 待上传资料
  | 'PENDING_AUDIT'    // 待交付出初审 (Shared to Delivery)
  | 'PENDING_APPROVAL' // 待管理确认 (Submitted by Delivery)
  | 'AUDIT_COMPLETE'   // 初审完成 (Manager Approved)
  | 'COMPLETED';       // 已完成

export interface AuditData {
  limit: string;    // 初审额度
  product: string;  // 匹配产品
  remark?: string;  // 备注
  submittedAt?: string;
  approvedAt?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  source: string;
  amount: string; // 需求金额
  type: string;   // 业务类型
  channel: string; // 消化渠道
  status: OrderStatus;
  statusText: string;
  createdAt: string;
  
  // Detailed info fields (mocked for the form)
  details: {
    companyName: string;
    establishDate: string;
    legalPersonAge: string;
    maritalStatus: string;
    personalAssets: string;
    companyFlow: string;
    demandDesc: string;
    reportLink?: string; // Water Jellyfish Report Link
  };

  // The critical audit data flow
  auditData?: AuditData;
  
  // File uploads status
  files: {
    idCard: boolean;
    businessLicense: boolean;
    companyCredit: boolean;
    personalCredit: boolean;
  };
}

export interface DailyStat {
  date: string;
  value: number;
}

export interface Statistics {
  totalOrders: number;
  totalAmount: string;
  approvalRate: number;
  pendingCount: number;
  funnel: {
    stage: string;
    count: number;
    color: string;
  }[];
  trend: DailyStat[];
}