# BotConnect

A modern chat interface application with real-time messaging capabilities.

## Features

- 🚀 Real-time chat interface
- 💬 Multiple conversation support
- 🤖 AI bot responses
- 📱 Responsive design
- 🔐 User authentication (with Nhost)
- 💾 Persistent chat history (with Nhost)
- ⚡ GraphQL subscriptions for real-time updates

## Configuration

This application is configured with Nhost for full functionality:

```env
VITE_NHOST_SUBDOMAIN=yvmegydgacgqiqxlffrr
VITE_NHOST_REGION=ap-south-1
```

## Database Schema

The following database schema is required in your Nhost project:

### Required Tables

**chats table:**
```sql
CREATE TABLE chats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**messages table:**
```sql
CREATE TABLE messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  content text NOT NULL,
  sender_type text NOT NULL CHECK (sender_type IN ('user', 'bot')),
  chat_id uuid REFERENCES chats(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);
```

### Row Level Security (RLS)

Enable RLS and create policies:

```sql
-- Enable RLS
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Chats policies
CREATE POLICY "Users can view own chats" ON chats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chats" ON chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chats" ON chats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chats" ON chats
  FOR DELETE USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Technologies Used

- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Nhost** - Backend-as-a-Service
- **Apollo Client** - GraphQL client
- **GraphQL Subscriptions** - Real-time updates
- **Lucide React** - Icons
- **Vite** - Build tool