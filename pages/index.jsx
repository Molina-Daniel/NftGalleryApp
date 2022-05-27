import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'

const Home = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [collectionAddress, setCollectionAddress] = useState("");

  const walletInputHandler = (event) => {
    setWalletAddress(event.target.value);
  }

  const collectionInputHandler = (event) => {
    setCollectionAddress(event.target.value);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <input onChange={walletInputHandler} value={walletAddress} type="text" name="" id="" placeholder='Wallet address' />
      <input onChange={collectionInputHandler} value={collectionAddress} type="text" name="" id="" placeholder='Collection address' />
      <label htmlFor=""><input type="checkbox" name="" id="" /></label>
      <button type="submit">Let's go!</button>
    </div>
  )
}

export default Home
