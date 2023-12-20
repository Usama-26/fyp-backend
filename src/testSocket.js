const io = require('socket.io-client');

console.log('trying to connect to localhost:8000');
// Replace 'http://localhost:8000' with your server URL
const socket = io.connect('http://localhost:8000', {
  query: { userId: '6579a658ae3f317ffb903bdc' },
});

// Emit an event to update online status
console.log('Emitting online status:', 'online');
socket.emit('online status', 'online');

// Listen for online users update
socket.on('online users', (onlineUsers) => {
  console.log('Online Users:', onlineUsers);
});

// Disconnect after 5 seconds (for testing purposes)
setTimeout(() => {
  socket.disconnect();
}, 50000);
