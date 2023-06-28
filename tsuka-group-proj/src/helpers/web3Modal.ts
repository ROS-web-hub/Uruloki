import Web3Modal from "web3modal";
import { ethers } from "ethers";
export const getWeb3Modal = async () => {
    const providerOptions = {};
  
    const web3Modal = new Web3Modal({
      cacheProvider: true, // optional
      providerOptions, // required
    });
  
    return web3Modal;
  };

  export const getConnectedAddress = async () => {
    // Get wallet address connected
    if (typeof window !== 'undefined') {
        const web3Modal = await getWeb3Modal();
        const provider = await web3Modal.connect();
        const signer = new ethers.providers.Web3Provider(provider).getSigner();
        const address = await signer.getAddress();
        console.log("Connected address:", address);
        return address;
      }
      return "";
  };

