import { useState, useMemo, useReducer } from 'react'
import { NFTCard } from './components/NFTCard'
import Pagination from './components/Pagination'

/**
 * TODOs:
 * - Add fetch NFTs from Polygon network
 * - Add spinner while fetching data
 * - Add popup at mouse when copy contract address to clipboard
 * - Add responsive design
 * - Improve general look and feel
*/

const reducer = (state, action) => {
  if (action.type == 'add') {
    const stateArray = [...state, action.data]
    return stateArray.flat(1)
  }
}

const Home = (props) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [collectionAddress, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchByCollection, setFetchByCollection] = useState(false);
  const [totalNFTs, setTotalNFTs] = useState(0);
  const [state, dispatch] = useReducer(reducer, [])
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const PageSize = 100;

  const currentNFTsData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return NFTs.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, NFTs, state]);

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
      fetchNFTsByCollection();
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

  const fetchNFTsByCollection = async () => {
    if (collectionAddress.length) { 
      async function callGetNFTsForCollectionOnce(startToken = "") {
        const API_KEY = props.API_KEY;
        const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${API_KEY}/getNFTsForCollection/`;
        const fetchURL = `${baseURL}?contractAddress=${collectionAddress}&withMetadata=${"true"}&startToken=${startToken}`;
        const requestOptions = {method: 'GET', redirect: 'follow'};
        const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
        return nfts;
      }

      let startToken = ''
      let hasNextPage = true
      let totalNftsFound = 0

      while (hasNextPage) {
        const { nfts, nextToken } = await callGetNFTsForCollectionOnce(
          startToken
        );

        if (!nextToken) {
          // When nextToken is not present, then there are no more NFTs to fetch.
          hasNextPage = false;
        }

        startToken = nextToken;
        totalNftsFound += nfts.length;
        setTotalNFTs(totalNftsFound);
        dispatch({type: 'add', data: nfts})
        console.log(nfts);
      }
    }
    
    if (state) {
      console.log("NFTs in collection:", state);
      setNFTs(state);
      console.log(state);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input disabled={fetchByCollection} onChange={walletInputHandler} value={walletAddress} type="text" name="" id="" placeholder='Wallet address'  className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" />
        <input onChange={collectionInputHandler} value={collectionAddress} type="text" name="" id="" placeholder='Collection address' className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" />
        <label className="text-gray-600" htmlFor=""><input onChange={fetchByCollectionHandler} type="checkbox" name="" id="" className="mr-2" />Fetch By Collection</label>
        <button onClick={buttonHandler} className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"}>Show the NFTs</button>
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        { NFTs.length > 0 && currentNFTsData.map(nft => {
        return (
          <NFTCard key={nft.id.tokenId} nft={nft} />
        )})}
      </div>
      { NFTs.length > 0 && (
        <Pagination
          className="w-full justify-center"
          currentPage={currentPage}
          totalCount={totalNFTs}
          pageSize={PageSize}
          onPageChange={page => setCurrentPage(page)}
        />
      )}
    </div>
  )
}

export async function getStaticProps() {
  const API_KEY = process.env.API_KEY;
  console.log('[Node.js only] ENV_VARIABLE:', API_KEY);
  return { props: { API_KEY: API_KEY } };
}

export default Home
