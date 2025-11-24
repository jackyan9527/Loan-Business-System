import { Order, Statistics } from './types';

export const MOCK_ORDERS: Order[] = [
  {
    id: 'OD20251120001',
    customerName: '王某某',
    phone: '138****5678',
    source: '中介-张经理',
    amount: '500万',
    type: '企业经营贷',
    channel: '张三',
    status: 'PENDING_AUDIT',
    statusText: '进行中：交付初审',
    createdAt: '2025-11-20',
    details: {
      companyName: '某某科技有限公司',
      establishDate: '2018-05-12',
      legalPersonAge: '38岁',
      maritalStatus: '已婚',
      personalAssets: '房产2套，车辆1台',
      companyFlow: '1500万',
      demandDesc: '企业扩大生产经营，需要资金支持',
    },
    files: {
      idCard: true,
      businessLicense: true,
      companyCredit: true,
      personalCredit: false,
    },
    auditData: undefined
  },
  {
    id: 'OD20251120002',
    customerName: '李某某',
    phone: '139****1234',
    source: '自流量',
    amount: '200万',
    type: '个人消费贷',
    channel: '李四',
    status: 'PENDING_UPLOAD',
    statusText: '待上传资料',
    createdAt: '2025-11-21',
    details: {
      companyName: '个体户李记',
      establishDate: '2020-01-10',
      legalPersonAge: '29岁',
      maritalStatus: '未婚',
      personalAssets: '房产1套',
      companyFlow: '500万',
      demandDesc: '装修贷款',
    },
    files: {
      idCard: true,
      businessLicense: false,
      companyCredit: false,
      personalCredit: false,
    },
  },
  {
    id: 'OD20251120003',
    customerName: '赵某某',
    phone: '136****8765',
    source: '第三方-某平台',
    amount: '800万',
    type: '企业抵押贷',
    channel: '张三',
    status: 'PENDING_APPROVAL',
    statusText: '待管理确认',
    createdAt: '2025-11-19',
    details: {
      companyName: '赵氏贸易',
      establishDate: '2015-11-11',
      legalPersonAge: '45岁',
      maritalStatus: '离异',
      personalAssets: '别墅1栋',
      companyFlow: '3000万',
      demandDesc: '过桥垫资',
    },
    files: {
      idCard: true,
      businessLicense: true,
      companyCredit: true,
      personalCredit: true,
    },
    auditData: {
      limit: '750万',
      product: '兴业银行快易贷',
      submittedAt: '2025-11-20 10:00'
    }
  },
  {
    id: 'OD20251120004',
    customerName: '陈某某',
    phone: '135****4321',
    source: '中介-李经理',
    amount: '350万',
    type: '个人经营贷',
    channel: '李四',
    status: 'COMPLETED',
    statusText: '已完成',
    createdAt: '2025-11-15',
    details: {
      companyName: '陈氏餐饮',
      establishDate: '2019-03-15',
      legalPersonAge: '33岁',
      maritalStatus: '已婚',
      personalAssets: '房产1套',
      companyFlow: '800万',
      demandDesc: '开分店',
    },
    files: {
      idCard: true,
      businessLicense: true,
      companyCredit: true,
      personalCredit: true,
    },
    auditData: {
      limit: '350万',
      product: '建设银行云税贷',
      submittedAt: '2025-11-15 09:00',
      approvedAt: '2025-11-15 11:00'
    }
  },
   {
    id: 'OD20251120005',
    customerName: '刘某某',
    phone: '133****9999',
    source: '自流量',
    amount: '1200万',
    type: '企业经营贷',
    channel: '王五',
    status: 'AUDIT_COMPLETE',
    statusText: '初审完成',
    createdAt: '2025-11-18',
    details: {
      companyName: '刘氏物流',
      establishDate: '2010-06-20',
      legalPersonAge: '50岁',
      maritalStatus: '已婚',
      personalAssets: '房产3套',
      companyFlow: '5000万',
      demandDesc: '购买新车',
    },
    files: {
      idCard: true,
      businessLicense: true,
      companyCredit: true,
      personalCredit: true,
    },
    auditData: {
      limit: '1000万',
      product: '平安银行宅抵贷',
      submittedAt: '2025-11-18 14:00',
      approvedAt: '2025-11-18 16:30'
    }
  }
];

export const MOCK_STATS: Statistics = {
  totalOrders: 156,
  totalAmount: '4.2亿',
  approvalRate: 78,
  pendingCount: 42,
  funnel: [
    { stage: '资料上传', count: 156, color: 'bg-blue-200' },
    { stage: '交付初审', count: 124, color: 'bg-blue-300' },
    { stage: '管理确认', count: 98, color: 'bg-blue-400' },
    { stage: '放款完成', count: 85, color: 'bg-blue-600' },
  ],
  trend: [
    { date: '11-01', value: 12 },
    { date: '11-05', value: 19 },
    { date: '11-10', value: 15 },
    { date: '11-15', value: 25 },
    { date: '11-20', value: 22 },
    { date: '11-25', value: 30 },
  ]
};