import axios from 'axios';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Auth API
export const authApi = {
  getUser: async () => {
    const response = await api.get('/user');
    return response.data;
  },
  updateUser: async (data: any) => {
    const response = await api.put('/user', data);
    return response.data;
  },
  getUserById: async (userId: number) => {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  },
  updateUserById: async (userId: number, data: any) => {
    const response = await api.put(`/user/${userId}`, data); 
    return response.data;
  },
  deleteUser: async () => {
    await api.delete('/user');
  },
};


// Export all individual API services for easier import

// Messages API
export const messagesApi = {
  
  createMessage: async (data: any): Promise<any> => {
    const response = await api.post('/messages', data);
    return response.data;
  },

  getUserStatus: async (userId: number): Promise<{ online: boolean }> => {
    const response = await api.get(`/messages/user-status/${userId}`);
    return response.data;
  },

  getUserChats: async (): Promise<any> => {
    const response = await api.get('/messages');
    return response.data;
  },

  getUnreadMessages: async (senderId: number): Promise<any[]> => {
    const response = await api.get(`/messages/unread/${senderId}`);
    return response.data;
  },

  getConversation: async (senderId: number, recipientId: number): Promise<any[]> => {
    const response = await api.get(`/messages/${senderId}/${recipientId}`);
    return response.data;
  },

  clearUnreadMessages: async (senderId: number): Promise<void> => {
    await api.patch(`/messages/unread/clear/${senderId}`);
  },
};



export default api; // Export the axios instance as default if needed elsewhere