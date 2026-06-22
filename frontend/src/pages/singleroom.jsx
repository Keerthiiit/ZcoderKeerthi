import React, { useState, useEffect, useRef } from 'react';
import AuthNav from '../components/authnav';
import { isAuthenticated } from '../../util';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/singleroom.css';
import API from "../config/api";
import socket from "../socket/socket"; // Very important for rooms


const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [usersOnline, setUsersOnline] = useState([]);
  const messagesEndRef = useRef(null);
  const usersPanelRef = useRef(null);
  const [showUsersPanel, setShowUsersPanel] = useState(false);
  const navigate=useNavigate();
  const {id} = useParams();
  const [roomName, setRoomName] = useState(`Room ${id}`);
  const userName = localStorage.getItem('handle');
  const [room,setRoom] = useState(null);

  useEffect( () => {


      const handle= localStorage.getItem('handle');
      socket.emit('joinRoom', { id, handle });

      return () => {
      socket.disconnect();
      console.log('Socket disconnected');
    };

    }, [id,navigate]);


    useEffect(() => {

      
      
      socket.on('recieve-message', (message) => {
        const newmessage={
            user: message.handle,
            text: message.text,
            timestamp: new Date(message.time)
        }
        // console.log(newmessage);
        setMessages([...messages, newmessage]);
      });
      scrollToBottom();

    }, [messages]);

    useEffect(() => {

      
      socket.on('roomUsers', (data) => {
        // console.log(data);
        setUsersOnline(data.users);
      });
    
    }, [usersOnline]);


    useEffect(() => {
   
    const fetchMessages = async () => {
      try {
          const token = localStorage.getItem('token');
            if (!token) {
              navigate('/login');
              return;
            }

          const response = await fetch(`${API}/messages`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token, id }),
            });

            const messagesData = await response.json();

            if (messagesData && messagesData.success) {
              setMessages(messagesData.messages);
            } else {
              console.log(messagesData);
            }
          } catch (err) {
            localStorage.removeItem('token');
            localStorage.removeItem('handle');
            console.error('Token verification failed', err);
            navigate('/login');
          }
        
    };

    fetchMessages();
  }, [navigate,id]);
    

    useEffect(()=>{
          if (!isAuthenticated()) {
            localStorage.removeItem('token');
            localStorage.removeItem('handle');
            navigate('/login');
          }
    },[navigate]);

  useEffect(() => {
    
    const initialUsers = [userName];
    setMessages([]);
    setUsersOnline(initialUsers);
    scrollToBottom();

  }, [roomName, userName]);


   useEffect(() => {
     const stored = localStorage.getItem('rooms');      
    const rooms = stored ? JSON.parse(stored) : []; 
    const matchedRoom = rooms.find(room => room.id == id);
    setRoomName(matchedRoom.name);
    setRoom(matchedRoom)

  }, [id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message = {
      user: userName,
      text: newMessage,
      timestamp: new Date(),
    };

    socket.emit('send-message',{ handle: message.user, text:newMessage})

    setMessages([...messages, message]);
    setNewMessage('');
    scrollToBottom();
  };

  const formatTime = (date) => {

    const newdate= new Date(date);
    return newdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (

    <>
    <AuthNav/>
    <div className="chat-room-container">
      <div className="chat-header">

        <button 
          className="mobile-menu-btn"
          onClick={() => setShowUsersPanel(!showUsersPanel)}
          aria-label="Toggle user list"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        
        <h2>{roomName}</h2>
        { room && <div className="room-topic">{room.description}</div>}
      </div>

      <div className="chat-content">
        <div 
          ref={usersPanelRef}
          className={`users-online ${showUsersPanel ? 'visible' : ''}`}
        >
          <h3>Online Users ({usersOnline.length})</h3>
          <ul>
            {usersOnline.map((user, index) => (
              <li key={index} className={user.handle === userName ? 'current-user' : ''}>
                {user.handle}
              </li>
            ))}
          </ul>
        </div>

        <div className="messages-container">
          <div className="messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.user === userName ? 'sent' : 'received'}`}
              >
      
                  <div className={`message-user ${message.user === userName ? 'ms-sent' : 'ms-received'}`}>{message.user !== userName ? message.user : "You"}</div>
                <div className="message-text">{message.text}</div>
                <div className="message-time">{formatTime(message.timestamp)}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="message-form">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your doubts here..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>

    </>
  );
};

export default ChatRoom;