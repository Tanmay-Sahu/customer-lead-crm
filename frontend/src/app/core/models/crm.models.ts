export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PagedResponse<T> {
  content: T[];
  pageable: any;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: any;
  numberOfElements: number;
}

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  INTERESTED = 'INTERESTED',
  FOLLOW_UP = 'FOLLOW_UP',
  VISIT_SCHEDULED = 'VISIT_SCHEDULED',
  NEGOTIATION = 'NEGOTIATION',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST',
  NOT_INTERESTED = 'NOT_INTERESTED'
}

export enum Priority {
  HOT = 'HOT',
  WARM = 'WARM',
  COLD = 'COLD',
  NOT_CUSTOMER = 'NOT_CUSTOMER'
}

export interface User {
  id: number;
  username: string;
  name: string;
  role: 'ADMIN' | 'EXECUTIVE';
  createdDate: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  name: string;
  role: 'ADMIN' | 'EXECUTIVE';
  message: string;
}

export interface LeadType {
  id: number;
  leadTypeName: string;
  description: string;
  createdDate: string;
}

export interface CustomerLead {
  id: number;
  customerName: string;
  mobile: string;
  alternateNumber?: string;
  email?: string;
  leadTypeId: number;
  leadTypeName: string;
  city?: string;
  address?: string;
  requirement?: string;
  leadSource?: string;
  assignedExecutive?: string;
  discussionDetails?: string;
  visitDate?: string;
  nextFollowupDate?: string;
  status: LeadStatus;
  priority: Priority;
  createdDate: string;
}

export interface LeadSearchRequest {
  customerName?: string;
  mobile?: string;
  city?: string;
  leadTypeId?: number;
  status?: LeadStatus;
  priority?: Priority;
  createdDateFrom?: string;
  createdDateTo?: string;
  nextFollowupDateFrom?: string;
  nextFollowupDateTo?: string;
  page: number;
  size: number;
  sortBy: string;
  sortDir: string;
}

export interface DashboardResponse {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  interestedLeads: number;
  followUpLeads: number;
  visitScheduledLeads: number;
  negotiationLeads: number;
  closedWonLeads: number;
  closedLostLeads: number;
  notInterestedLeads: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  todaysFollowUps: number;
  overdueFollowUps: number;
  upcomingFollowUps: number;
  totalNotes: number;
  totalLeadTypes: number;
  totalUsers: number;
  statusStats: { [key: string]: number };
  priorityStats: { [key: string]: number };
  leadTypeStats: { [key: string]: number };
  cityStats: { [key: string]: number };
  monthlyStats: { [key: string]: number };
}

export interface FollowUp {
  id: number;
  leadId: number;
  discussion: string;
  followUpDate: string;
  status: string;
  createdAt: string;
}

export interface Note {
  id: number;
  leadId: number;
  note: string;
  createdDate: string;
}
