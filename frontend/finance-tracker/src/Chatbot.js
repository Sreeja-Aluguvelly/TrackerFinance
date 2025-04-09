import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Stack, Box } from '@mui/material';
import { useAuth } from './AuthContext'; 
import { askChatbot } from './api'; 
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const { authState } = useAuth();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);

    try {
      const data = await askChatbot(authState.token, input);

      setMessages([
        ...newMessages,
        {
          sender: 'bot',
          text: data.response,
        },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([
        ...newMessages,
        {
          sender: 'bot',
          text: 'Sorry, something went wrong. 🤖',
        },
      ]);
    } finally {
      setInput('');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>Ask FinanceBot 💬</Typography>
      <Paper elevation={3} sx={{ height: 300, overflowY: 'auto', p: 2, mb: 2 }}>
        <Stack spacing={1}>
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              component="pre"
              sx={{
                textAlign: msg.sender === 'user' ? 'right' : 'left',
                backgroundColor: msg.sender === 'user' ? '#1E40AF' : '#E5E7EB',
                color: msg.sender === 'user' ? 'white' : 'black',
                p: 1.5,
                borderRadius: 2,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {msg.sender === 'bot' ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                msg.text
              )}
            </Box>
          ))}
        </Stack>
      </Paper>
      <Stack direction="row" spacing={1}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something like 'What did I spend last week?'"
        />
        <Button onClick={sendMessage} variant="contained" color="primary">Send</Button>
      </Stack>
    </Box>
  );
};

export default Chatbot;
