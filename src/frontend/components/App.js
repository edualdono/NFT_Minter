import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './Navbar';
import Create from './Create';
import { useState } from 'react';
import { ethers } from 'ethers';
import NFTAbi from '../contractsData/NFT.json';
import NFTAddress from '../contractsData/NFT-address.json';
import {
  Spinner
} from 'react-bootstrap';
import './App.css';
 
function App() {

  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [nft, setNFT] = useState({});

  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log(accounts)
    setAccount(accounts[0])
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0]);
      await web3Handler();
    })

    loadContracts(signer);
  }

  const loadContracts = async (signer) => {
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
    setNFT(nft);
    setLoading(false);
  }

  return (
    <BrowserRouter>
      <div className='App'>
        <>
          <Navigation web3Handler={web3Handler} account={account} />
        </>
        <div>
          {loading ? (
            <div style={
              {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh'
              }
            }>
            <Spinner animation='border' style={{ display: 'flex' }} />
            <p className='mx-3 my-0'>Waiting for Metamask's connection ...</p>
            </div>
          ): (
              <Routes>
                <Route path='/' element={
                  <Create nft={nft} />
                } />
              </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;