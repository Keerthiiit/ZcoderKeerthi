import { Link } from 'react-router-dom';
import '../../styles/home/community.css';
import CommunityRooms from './communityrooms';

const Community = () => {

  const activeRooms = [
    {
      id: 2,
      name: "DP Study Group",
      topic: "Learn and discuss DP Patterns",
      participants: 8
    },
    {
      id: 4,
      name: "React Interview Prep",
      topic: "Frontend Development",
      participants: 6
    }
  ];

  return (
    <section className="community-section">
        <div className="community-content">
          <div className="community-text">
            <h2 className="section-title">Join Our Community</h2>
            <p>
              Connect with other developers in our interactive rooms. 
              Get real-time help, discuss approaches, and collaborate on projects.
            </p>
            <Link to="/rooms" className="cta-button primary">Explore Rooms</Link>
          </div>
          <div className="active-rooms">
            <h3>Active Rooms Right Now</h3>
            <div className="rooms-list">
              {activeRooms.map(room => (
                <CommunityRooms key={room.id} room={room}/>
              ))}
            </div>
          </div>
        </div>
      </section>
  )
}

export default Community