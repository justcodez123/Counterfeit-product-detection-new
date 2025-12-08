import './components/app.css';
import AddProduct from './components/AddProduct/AddProduct';
import CreateContract from './components/CreateContract/CreateContract';
// import GetContract from './components/GetContract/GetContract';
import Home from './components/Home/Home';
import Navigation from './components/Navigation/Navigation';
//import QRScanner from './components/QRScanner/QRScanner';
import ProductAuthenticator from './components/VerifyProduct/ProductAuthenticator';
import React,{useState} from 'react';
//import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

export const Metamask = () => {
  const [account, setAccount] = useState(null);
  return <Navigation account={account} setAccount={setAccount} />;
};

function ProtectedRoute({ children }) {
  const isGuest = localStorage.getItem("guestUser") === "true";
  const location = useLocation();

  if (isGuest && location.pathname !== "/VerifyProduct") {
    return <Navigate to="/VerifyProduct" replace />;
  }

  return children;
}

function App({location}) {

  const [account, setAccount] = useState(null);

  return (
      <>  
      <Navigation account={account} setAccount={setAccount} />
           <Routes location = {location}>
            <Route exact path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route exact path="/AddProduct" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
            <Route exact path="/CreateContract" element={<ProtectedRoute><CreateContract /></ProtectedRoute>} />
            {/* <Route exact path="/GetContract" element={<GetContract />} /> */}
            <Route exact path="/VerifyProduct" element={<ProductAuthenticator />} />
            {/* <Route exact path="/QRScanner" element={<ProtectedRoute><QRScanner /></ProtectedRoute>} /> */}
           </Routes>
      </>
  );
}


export default App ;