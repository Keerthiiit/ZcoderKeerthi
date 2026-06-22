import '../../styles/home/community.css'

const CommunityRooms = ({room}) => {
  return (
    <div className="room-item">
                  <div className="room-info">
                    <h4>{room.name}</h4>
                    <p>{room.topic}</p>
                  </div>
                  <div className="room-participants">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path d="M12 4a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z"/>
                  </svg> {room.participants}
                  </div>
    </div>
  )
}

export default CommunityRooms