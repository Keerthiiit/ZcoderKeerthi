import '../styles/homepage.css';
import NotAuthnav from '../components/notauthnav';
import AuthNav from '../components/authnav';
import { isAuthenticated } from '../../util';
import Footer from '../components/footer';
import Hero from '../components/home/hero-section';
import Features from '../components/home/features';
import Problems from '../components/home/problem-section';
import Solutions from '../components/home/solutions-section';
import Community from '../components/home/community';

const HomePage = () => {
  

  return (
    <>
    
    { isAuthenticated() ? <AuthNav/> : <NotAuthnav />}
   

    <div className="home-container">
      
      <Hero/>
      <Features/>
      <Problems/>
      <Solutions/>
      <Community/>
      
    </div>

    <Footer/>

     
     </>
  );
};

export default HomePage;