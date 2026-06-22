import { useState, useEffect } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import Footer from '../components/footer';
import AuthNav from '../components/authnav';
import { isAuthenticated } from '../../util';
import '../styles/roomspage.css';
import API from "../config/api";


const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate=useNavigate();
  

  useEffect(() => {
   
    const fetchRooms = async () => {
      try {
          const token = localStorage.getItem('token');
            if (!token) {
              navigate('/login');
              return;
            }

           const response = await fetch(`${API}/rooms/getrooms`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token }),
            });

            const roomsData = await response.json();

            if (roomsData && roomsData.success) {
              setRooms(roomsData.rooms);
              localStorage.setItem('rooms', JSON.stringify(roomsData.rooms));
            } else {
              localStorage.removeItem('token');
              navigate('/login');
            }
          } catch (err) {
            localStorage.removeItem('token');
            localStorage.removeItem('handle');
            console.error('Token verification failed', err);
            navigate('/login');
          }
        
          setLoading(false);
    };

    fetchRooms();
  }, [navigate]);

  useEffect(()=>{
          if (!isAuthenticated()) {
            localStorage.removeItem('token');
            localStorage.removeItem('handle');
            navigate('/login');
          }
    },[navigate]);

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <><AuthNav/>
        <div className="loading">Loading rooms...</div>
        <Footer/>
        </>
  }

  return (
    <><AuthNav/>
    <div className="rooms-container">
      <div className="rooms-header">
        <h1>Collaboration Rooms</h1>
        <p>Join a room to collaborate with other coders</p>
      </div>

      <div className="rooms-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg className="search-icon" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>

      </div>

      <div className="rooms-grid">
        {filteredRooms.length > 0 ? (
          filteredRooms.map(room => (
            <Link to={`/rooms/${room.id}`} key={room.id} className="room-card">
              <div className="room-header">
                <h3>{room.name}</h3>
              </div>
              <p className="room-description">{room.description}</p>
              <div className="room-footer">
                <span className="topic-tag">{room.topic}</span>
                <div className="participants">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M12 4a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z"/>
                  </svg>
                  <span>{room.participants} active</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="no-rooms">
            <p>No rooms found matching your search</p>
            <button onClick={() => setSearchQuery('')}>Clear search</button>
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default RoomsPage;