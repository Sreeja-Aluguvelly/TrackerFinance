import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Stack, Box } from '@mui/material';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);

    try {
      // Send message to the backend via API and get the response from AI
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: input,
          user_id: "user1",
        }),
      });

      const data = await response.json();
      setMessages([...newMessages, { sender: 'bot', text: data.reply }]);
      setInput('');
    } catch (error) {
      console.error('Error:', error);
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
              sx={{
                textAlign: msg.sender === 'user' ? 'right' : 'left',
                backgroundColor: msg.sender === 'user' ? '#1E40AF' : '#E5E7EB',
                color: msg.sender === 'user' ? 'white' : 'black',
                p: 1.5,
                borderRadius: 2,
              }}
            >
              {msg.text}
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
