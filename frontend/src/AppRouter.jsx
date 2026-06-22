import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/loginpage';
import RegisterPage from './pages/registerpage';
import UserProfilePage from './pages/userprofile';
import HomePage from './pages/homepage'; 
import ContestPage from './pages/contestpage';
import ProblemsPage from './pages/problemspage';
import ProblemPage from './pages/singleproblem';
import Otheruserpage from './pages/otheruser';
import NotFound from './pages/notfound';
import OTPVerify from './pages/otpverify';
import RoomsPage from './pages/roomspage';
import ChatRoom from './pages/singleroom';


const AppRouter = () => {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/contests" element={<ContestPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/otpverify" element={<OTPVerify />} />


        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/user/:id" element={<Otheruserpage />} />


        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/rooms/:id" element={<ChatRoom />} />

        <Route path="/problems" element={<ProblemsPage />} />
        
        <Route path="/problems/:id" element={<ProblemPage />} />

        <Route path="*" element={<NotFound />} /> 
        
      </Routes>
    </Router>
  );
};

export default AppRouter;