import { useState, useEffect } from "react";
import { ethers, providers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useDispatch, useSelector } from "react-redux";
import { connect, startUp } from "../redux/blockchain/blockchainActions";
import * as s from "../styles/globalStyles";
import "./Navbar.css";


 const NavBar = () => {
    const [click, setClick] = useState(false);
    const [provider, setProvider] = useState();
    const [web3modal, setWeb3modal] = useState();
    const [connected, setConnected] = useState(false);
    const [userAddress, setUserAddress] = useState();
    const [account, setAccount] = useState("Connect Wallet");
    const [signer, setSigner] = useState();
    const blockchain = useSelector((state) => state.blockchain);
    const handleClick = () => setClick(!click);
    const Close = () => setClick(false);

    useEffect(() => {
        let account = blockchain.account;
        console.log("account = , connected", account, blockchain.connected);
        setConnected(blockchain.connected);
        let address = account
            ? account.slice(2, 6) + "..." + account.slice(38, 42)
            : "Connect Wallet";
        if (blockchain.connected) {
            setAccount(address);
        }
        // dispatch(startUp());
      }, [blockchain]);
    

    const dispatch = useDispatch();
    const handleConnection = async (e) => {
        dispatch(connect());

        // const providerOptions = {
        //     walletconnect: {
        //         package: WalletConnectProvider, // required
        //         options: {
        //             chainId: 25,
        //             rpc: {
        //                 25: "https://evm-cronos.crypto.org/",
        //             },
        //         },
        //     },

        //     injected: {
        //         display: {
        //             logo: "https://github.com/MetaMask/brand-resources/raw/master/SVG/metamask-fox.svg",
        //             name: "MetaMask",
        //             description: "Connect with MetaMask in your browser",
        //         },
        //         package: null,
        //     },
        // };

        // const web3Modal = new Web3Modal({
        //     cacheProvider: false, // optional
        //     providerOptions, // required
        // });

        // if (connected) {
        //     web3Modal.clearCachedProvider();
        //     window.location.reload();
        //     //   await getNFTData();
        //     setProvider("");
        //     setWeb3modal("");
        //     setConnected(false);
        //     setSigner("");
        //     setUserAddress("");
        // } else {
        //     const connection = await web3Modal.connect();
        //     const provider = new ethers.providers.Web3Provider(connection);
        //     const signer = provider.getSigner();
        //     const addy = await signer.getAddress();
        //     setWeb3modal(web3Modal);
        //     setProvider(provider);
        //     setSigner(signer);
        //     setUserAddress(addy);
        //     setConnected(true);
        // }
    };

    return (
        <div style={{width : "100%"}}>
            <div className={click ? "main-container" : ""} onClick={() => Close()} />
            <nav className="navbar" onClick={e => e.stopPropagation()}>
                <div className="nav-container">
                    <a href="#" className="nav-logo">
                    <s.StyledLogo alt={"logo"} src={"/config/images/logo.png"} />
                    </a>
                    <ul className={click ? "nav-menu active" : "nav-menu"}>
                        <li className="nav-item">
                            <a
                                href="#"
                                className="nav-links"
                                onClick={click ? handleClick : null}
                            >
                                Home
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                href="#"
                                className="nav-links"
                                onClick={click ? handleClick : null}
                            >
                                Collections
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                href="#"
                                className="nav-links"
                                onClick={click ? handleClick : null}
                            >
                                Roadmap
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                href="#"
                                className="nav-links"
                                onClick={click ? handleClick : null}
                            >
                                Tokenomics
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                href="#"
                                className="nav-links"
                                onClick={click ? handleClick : null}
                            >
                                Whitepaper
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                href="#"
                                className="nav-links"
                                onClick={click ? handleClick : null}
                            >
                                Contact Us
                            </a>
                        </li>
                        <li className="nav-connect">
                            <a href="#" onClick={(e) => {
                                e.preventDefault();
                                handleConnection();
                            }}>
                                {account}
                            </a>
                        </li>
                    </ul>

                    <div className="nav-icon" onClick={handleClick}>
                        <i className={click ? "fa fa-times" : "fa fa-bars"}></i>
                    </div>
                </div>
            </nav>
        </ div>
    );
}
export default NavBar;