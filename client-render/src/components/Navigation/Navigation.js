import { useEffect } from 'react';
import './Navigation.css';
import { useNavigate } from 'react-router-dom';

const Navigation = ({ account, setAccount }) => {
  const navigate = useNavigate();

  function showErrorMessage(error) {
    alert(`An error occurred while connecting to MetaMask: ${error.message}`);
  }

  // Function to get the connected account (fallback in case state is not updating)
  // const getConnectedAccount = async () => {
  //   if (window.ethereum) {
  //     const accounts = await window.ethereum.request({ method: 'eth_accounts' });
  //     return accounts.length > 0 ? accounts[0] : null;
  //   }
  //   return null;
  // };

  const connectHandler = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed. Please install it.");
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      if (accounts.length === 0) {
        throw new Error("No accounts found. Please connect your MetaMask wallet.");
      }

      setAccount(accounts[0]); // Store the first account
      console.log("MetaMask Connected:", accounts[0]); // Debugging log
    } catch (error) {
      console.error("MetaMask Connection Error:", error);
      showErrorMessage(error);
    }
  };

  // Fetch account when component mounts
  useEffect(() => {
    const fetchAccount = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                setAccount(accounts[0]);
            }
        }
    };

    fetchAccount();

    // Listen for MetaMask account changes
    if (window.ethereum) {
        window.ethereum.on("accountsChanged", (accounts) => {
            setAccount(accounts.length > 0 ? accounts[0] : null);
        });
    }

  }, [setAccount]);

  return (
    <nav className='nav container'>
      <div className='nav__menu'>
        <ul className='nav__list grid'>
        <li className='nav__item1'>
            <text className='nav__logo'>Product Registration</text>
        </li>
          <li className='nav__item'>
            <button className='nav__link button__toggleH' onClick={() => navigate('/')}>Home</button>
          </li>
          <li className='nav__item'>
            <button className='nav__link button__toggleC' onClick={() => navigate('/CreateContract')}>Create Contract</button>
          </li>
          {/* <li className='nav__item'>
            <button className='nav__link button__toggleF' onClick={() => navigate('/GetContract')}>Fetch Contract</button>
          </li> */}
          <li className='nav__item'>
            <button className='nav__link button__toggleA' onClick={() => navigate('/AddProduct')}>Add Products</button>
          </li>
          <li className='nav__item'>
            <button className='nav__link button__toggleV' onClick={() => navigate('/VerifyProduct')}>Verify Product</button>
          </li>
          <li>
            {account ? (
              <button type="button" className='button__toggle'>
                {account.slice(0, 6) + '...' + account.slice(-4)}
              </button>
            ) : (
              <button type="button" className='button__toggleMetamask' onClick={connectHandler}>
                Connect to MetaMask
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
