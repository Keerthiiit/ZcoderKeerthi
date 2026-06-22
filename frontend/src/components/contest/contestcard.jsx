import '../../styles/contest/contestcard.css';

const Contestcard = ( {contest }) => {

  const formatDate = (dateString) => {
  const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };

    const date = new Date(dateString + 'Z');

    return new Date(date).toLocaleString('en-US', options);
  };

  // console.log(formatDate(contest.start));

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getPlatformName = (url) => {
    if (url.includes('codeforces')) return 'Codeforces';
    if (url.includes('leetcode')) return 'LeetCode';
    if (url.includes('atcoder')) return 'AtCoder';
    if (url.includes('codechef')) return 'CodeChef';
    return url;
  };

  const getPlatfromCode = (url) => {
    if (url.includes('codeforces')) return 'CF';
    if (url.includes('leetcode')) return 'LC';
    if (url.includes('atcoder')) return 'AC';
    if (url.includes('codechef')) return 'CC';
    return url;
  }

  const getPlatfromClass = (url) => {
    if (url.includes('codeforces')) return 'codeforces';
    if (url.includes('leetcode')) return 'leetcode';
    if (url.includes('atcoder')) return 'atcoder';
    if (url.includes('codechef')) return 'codechef';
    return url;
  }


  return (

    <div className="contest-card">
              <div className="contest-platform">
                <div className={`platform-icon ${getPlatfromClass(contest.href)}`}>
                  {getPlatfromCode(contest.href)}
                </div>
                <span>{getPlatformName(contest.href)}</span>
              </div>
              
              <div className="contest-info">
                <h3>{contest.event}</h3>
                
                <div className="contest-details">
                  <div className="detail-item">
                    <svg viewBox="0 0 24 24">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                      <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                    <span>{formatDate(contest.start)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <svg viewBox="0 0 24 24">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                    </svg>
                    <span>{formatDuration(contest.duration)}</span>
                  </div>
                </div>
              </div>
              
              <div className="contest-actions">
                <a 
                  href={contest.href} 
                  target="_blank" 
                >
                  <button className="register-button">
                  Register
                </button>
                </a>
            
              </div>
            </div>
  )
}

export default Contestcard;