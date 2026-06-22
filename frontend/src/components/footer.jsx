import '../styles/footer.css'

// Change this else you would be caught because these links will redirect to my (Kameshwar) accounts :) -- signing off - AKR

const Footer = () => {

   let newdate= new Date();

  return (
    <div className="footer">
      Created By Keerthi Mrunalini &copy; {newdate.getFullYear()} 
      <br></br>
      <div className="followme">


      Follow me on
    
      <div className="follow-links">

        <a href="https://www.linkedin.com/in/keerthi-m-8625b72b0/" target="_blank" title="LinkedIn" className="footer-icon">
          <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg" alt="LinkedIn" width="22" className="footer-icon"></img>
        </a>
        <a href="https://github.com/KeerthiMrunalini" target="_blank" title="GitHub" className="footer-icon">
          <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg" alt="GitHub" width="22" className="footer-icon"></img>
    
      
        </a>
      </div>
      </div>
    </div>
  )
}

export default Footer;