import axios from 'axios';

// ⚠️ IMPORTANT: REPLACE THIS WITH YOUR AWS SERVER IP
// Keep http:// because we haven't set up SSL yet
const API_BASE_URL = 'http://65.2.37.3:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- TYPE DEFINITIONS ---
export interface User {
  id: number;
  username: string;
  telegram_chat_id: number;
  is_active: boolean;
  subscription_end: string;
  created_at: string;
}

export interface Trade {
  id: number;
  pair: string;
  strategy: string;
  signal_type: 'BUY' | 'SELL';
  entry_price: number;
  take_profit: number;
  stop_loss: number;
  exit_price?: number;
  pnl_percent?: number;
  status: 'ACTIVE' | 'CLOSED' | 'TIMEOUT';
  created_at: string;
}

export interface BotConfig {
  max_open_positions: number;
  risk_per_trade: number;
  min_confidence: number;
  is_trading_enabled: boolean;
}

// --- API FUNCTIONS ---

export const DashboardAPI = {
  getData: async () => {
    const [users, trades] = await Promise.all([
      api.get<User[]>('/users'),
      api.get<Trade[]>('/trades?limit=100')
    ]);
    return { users: users.data, trades: trades.data };
  }
};

export const UserAPI = {
  getAll: async () => (await api.get<User[]>('/users')).data,
  create: async (data: any) => (await api.post<User>('/users', data)).data,
  toggleStatus: async (id: number) => (await api.put(`/users/${id}/toggle`)).data,
};

export const TradeAPI = {
  getAll: async (limit: number = 100) => (await api.get<Trade[]>('/trades', { params: { limit } })).data,
  getActive: async () => (await api.get<Trade[]>('/trades/active')).data,
  closeTrade: async (id: number) => (await api.post(`/trades/${id}/close`)).data,
};

export const BotAPI = {
  getStatus: async () => (await api.get('/status')).data,
  getConfig: async () => (await api.get<BotConfig>('/config')).data,
  updateConfig: async (config: Partial<BotConfig>) => (await api.post('/config', config)).data,
};

// System Health Type
export interface SystemHealth {
  status: 'online' | 'offline';
  ram_usage_percent: number;
  disk_usage_percent: number;
  api_latency_ms: number;
  last_heartbeat: string; // Timestamp
  recent_logs: string[]; // Array of log strings
}

export const SystemAPI = {
  getHealth: async () => {
    const response = await api.get<SystemHealth>('/system/health');
    return response.data;
  },
  getLogs: async (lines: number = 50) => {
    const response = await api.get<{ logs: string[] }>('/system/logs', { params: { lines } });
    return response.data.logs;
  }
};