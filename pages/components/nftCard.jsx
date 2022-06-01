import { DuplicateIcon } from '@heroicons/react/solid';

const truncateContractAddress = (str) => {
  return `${str.substr(0, 5)}...${str.substr(str.length - 4)}`
}

export const NFTCard = ({nft}) => {

  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(nft.contract.address);
  }

  return (
    <div className="w-1/4 flex flex-col">
      <div className="rounded-md">
        <img className="object-cover h-128 w-full rounded-t-md" src={nft.media[0].gateway} alt="NFT image" />
      </div>

      <div className="flex flex-col y-gap-2 px-2 py-3 bg-slate-100 rounded-b-md h-110">
        <div>
          <h2 className="text-xl text-gray-800">{nft.title}</h2>
          <p className="text-gray-600">{nft.id.tokenId.substr(nft.id.tokenId.length - 4)}</p>
          <p className="text-gray-600 cursor-pointer" onClick={copyAddressToClipboard}>
            {truncateContractAddress(nft.contract.address)}
            <DuplicateIcon
              className="h-4 pl-1 cursor-pointer inline"
              onClick={copyAddressToClipboard}
            />
          </p>
        </div>

        <div className="flex-grow mt-2">
          <p className="text-gray-600">{nft.description?.substr(0, 150)}</p>
        </div>

        <div className="flex justify-center mb-1">
          <a
          className="py-2 px-4 bg-blue-500 w-1/2 text-center rounded-m text-white cursor-pointer"
          target={"_blank"}
          href={`https://etherscan.io/token/${nft.contract.address}`}>
          View on etherscan
          </a>
        </div>
      </div>
    </div>
  )
}