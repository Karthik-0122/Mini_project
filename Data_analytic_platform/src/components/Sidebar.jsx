import React from 'react';
import { 
  MessageSquare, 
  Users, 
  BookOpen, 
  FileSpreadsheet
} from 'lucide-react';

export default function Sidebar({ activeChat, onChatSelect }) {
  const recentChats = [
    { id: 1, name: 'List of Columns Available' }
  ];

  return (
    <div style={{
      width: '280px',
      height: '100vh',
      backgroundColor: '#F5F5F5',
      borderRight: '1px solid #E5E7EB',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* Header - Simplified */}
      <div style={{
        padding: '20px 16px',
        borderBottom: '1px solid #E5E7EB',
        height: '69px' // To match the original height
      }}>
        {/* Removed the black logo */}
      </div>

      {/* Spaces Section */}
      <div style={{ padding: '16px' }}>
        <div style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#6B7280',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Spaces
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <button style={{
            padding: '10px 12px',
            backgroundColor: '#E5E7EB', // This is 'Chat' - kept as active
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#1F2937',
            textAlign: 'left',
            transition: 'background-color 0.2s'
          }}>
            <MessageSquare size={18} />
            Chat
          </button>

          <button style={{
            padding: '10px 12px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#6B7280',
            textAlign: 'left',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Users size={18} />
            Pipeline Builder
          </button>

          <button style={{
            padding: '10px 12px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#6B7280',
            textAlign: 'left',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <BookOpen size={18} />
            Quick Profiler
          </button>

          <button style={{
            padding: '10px 12px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#6B7280',
            textAlign: 'left',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <FileSpreadsheet size={18} />
            File Converter
          </button>
        </div>
      </div>

      {/* Recent Chats */}
      <div style={{ 
        padding: '16px', 
        borderTop: '1px solid #E5E7EB',
        flex: 1, // This will push the section to take up remaining space
        overflowY: 'auto'
      }}>
        <div style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#6B7280',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Recent chats
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {recentChats.map(chat => (
            <button 
              key={chat.id}
              onClick={() => onChatSelect && onChatSelect(chat)}
              style={{
                padding: '10px 12px',
                backgroundColor: activeChat === chat.id ? '#E5E7EB' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '400',
                color: '#1F2937',
                textAlign: 'left',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activeChat !== chat.id) {
                  e.currentTarget.style.backgroundColor = '#E5E7EB';
                }
              }}
              onMouseLeave={(e) => {
                if (activeChat !== chat.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {chat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Free Plan Section - REMOVED */}

      {/* User Profile - REMOVED */}
      
    </div>
  );
}