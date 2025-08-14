export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Message {
  id: string;
  content: string;
  sender_type: 'user' | 'bot';
  created_at: string;
  chat_id: string;
  user_id: string;
}

export interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  messages?: Message[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}