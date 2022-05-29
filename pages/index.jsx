import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { NFTCard } from './components/nftCard';

const Home = (props) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [collectionAddress, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchByCollection, setFetchByCollection] = useState(false);

  const walletInputHandler = (event) => {
    setWalletAddress(event.target.value);
  }

  const collectionInputHandler = (event) => {
    setCollectionAddress(event.target.value);
  }

  const fetchByCollectionHandler = (event) => {
    setFetchByCollection(event.target.checked);
  }

  const buttonHandler = () => {
    if (fetchByCollection) {
      fetchNFTsForCollection();
    } else fetchNFTs();
  }
  
  const fetchNFTs = async () => {
    console.log("Fetching NFTs...");
    let nfts;
    const API_KEY = props.API_KEY;
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${API_KEY}/getNFTs/`;

    if (!collectionAddress.length) {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      const fetchURL = `${baseURL}?owner=${walletAddress}`;
      console.log("Fetch URL:", fetchURL);

      nfts = await fetch(fetchURL, requestOptions)
      .then(data => data.json());

    } else {
      console.log("Fetching NFTs from collection...");
      const fetchURL = `${baseURL}?owner=${walletAddress}&contractAddresses%5B%5D=${collectionAddress}`;
      nfts = await fetch(fetchURL, requestOptions)
      .then(data => data.json());
    }

    if (nfts) {
      console.log(nfts);
      setNFTs(nfts.ownedNfts);
    }
  }

  const fetchNFTsForCollection = async () => {
    if (collectionAddress.length) {
      const API_KEY = props.API_KEY;
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${API_KEY}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collectionAddress}&withMetadata=${"true"}`;

      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())

      if (nfts) {
        console.log("NFTs in collection:", nfts)
        setNFTs(nfts.nfts)
      }
    }
      
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <input onChange={walletInputHandler} value={walletAddress} type="text" name="" id="" placeholder='Wallet address' />
      <input onChange={collectionInputHandler} value={collectionAddress} type="text" name="" id="" placeholder='Collection address' />
      <label htmlFor=""><input onChange={fetchByCollectionHandler} type="checkbox" name="" id="" />Fetch By Collection</label>
      <button onClick={buttonHandler} type="submit">Show the NFTs</button>
      <div>{ NFTs.length && NFTs.map(nft => {
        return (
          <NFTCard nft={nft} />
        )
      })}</div>
    </div>
  )
}

export async function getStaticProps() {
  const API_KEY = process.env.API_KEY;
  console.log('[Node.js only] ENV_VARIABLE:', API_KEY);
  return { props: { API_KEY: API_KEY } };
}

export default Home
