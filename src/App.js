import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import "./styles/user-nfts.css";
import styled from "styled-components";
import NavBar from "./components/Navbar";

// Ethers
import { ethers, providers } from "ethers";

// Contract
import SmartContract from "./ABI/contract.json";
import { async } from "q";

const SmartContractAddress = "0xcae06e7b36cbb3bce19f41640f1104e99f5395f4";

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: #000000;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;
export const StyledRoundButton2 = styled.button`
  border-radius: 100%;
  border: none;
  padding: 8px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  margin-left: 10px;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;
export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;


export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--primary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [userNFT, setUserNFT] = useState([]);
  const [loadingNft, setloadingNft] = useState(false);
  const [connected, setConnected] = useState();
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });


  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10) {
      newMintAmount = 10;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    console.log("config", config)
    SET_CONFIG(config);
  };

  const getNFTData = async () => {
    try {
      const allUserNfts = [];
      const ownerTokens = await blockchain.smartContract
        .walletOfOwner(blockchain.account);
      for (let i = 0; i < ownerTokens.length; i++) {
        let uri = await fetch(
          `https://ipfs.io/ipfs/QmdwD6zxJcmSeDqGXGbFGU19JRgLfESVQC2naxXL2GCU1d/${ownerTokens[i]}.json`
        );
        let uriJson = await uri.json();
        uriJson.image = uriJson.image.replace(":/", "");
        allUserNfts.push(uriJson);
      }
      setloadingNft(false);
      setUserNFT(allUserNfts);
    } catch (err) {
      setloadingNft(false);
      console.log(err);
    }
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
    setConnected(blockchain.connected)
    if (blockchain.account) {
      console.log("CurrentAccount:", blockchain.account);
      getNFTData();
    }
  }, [blockchain.account]);


  const toFixed = (x) => {
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split('e-')[1]);
      if (e) {
        x *= Math.pow(10, e - 1);
        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
        e -= 20;
        x /= Math.pow(10, e);
        x += (new Array(e + 1)).join('0');
      }
    }
    return x;
  }


  const claimNFTs = async () => {

    try {
      let cost = data.cost.toString();
      console.log(cost)
      let gasLimit = CONFIG.GAS_LIMIT;
      let totalCostWei = toFixed(cost * mintAmount);
      let totalGasLimit = String(gasLimit * mintAmount);
      console.log("Cost: ", totalCostWei);
      console.log("Gas limit: ", totalGasLimit);
      setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
      setClaimingNft(true);
      await blockchain.smartContract
        .mint(blockchain.account, mintAmount, {
          gasLimit: String(totalGasLimit),
          value: String(totalCostWei),
        });
      setClaimingNft(false);
    } catch (error) {
      console.log(error);
      setClaimingNft(false);
    }
    await getNFTData();
  };


  const renderNFTs = () =>
    loadingNft ? (
      <s.TextTitle
        style={{
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Loading your NFT(s)...
      </s.TextTitle>
    ) :
      (
        userNFT.map((element) => (
          <div className="players-container">
            <div className="player-container">
              <div className="player">
                <div className="image-content">
                  <h2>{element.name}</h2>
                  <s.SpacerSmall />
                  <img src={`https://gateway.ipfs.io/${element.image}`} alt={element.name} />
                </div>
                <s.SpacerSmall />
              </div>
            </div>
          </div>
        )));

  return (
    <s.Screen>

      <s.Container
        flex={1}
        style={{ padding: 24 }}
        test={"#000"}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
        image2={CONFIG.SHOW_BACKGROUND ? "/config/images/bg2.png" : null}
      >
        <NavBar />

        <s.SpacerLarge />
        <div className="cr_row">
          <div className="cr_column">
            <img src="/config/images/Real Madrid.jpg" />
          </div>
          <div className="cr_column">
            <img src="/config/images/Juventus.jpg" />
          </div>
          <div className="cr_column">
            <img src="/config/images/Manchester United.jpg" />
          </div>
        </div>
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.SpacerMedium />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              paddingBottom: 24,
              maxWidth: "600px",
              margin: "auto"
            }}
          >

            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--primary-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>

              </>
            ) : (
              <>
                {!connected ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--primary-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--primaty-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--primary-text)",
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <button className="kave-btn"
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}>
                        <span className="kave-line"></span>
                        {claimingNft ? "Busy" : "Mint Now"}
                      </button>
                    </s.Container>
                  </>
                )}
              </>
            )}
          </s.Container>
          <s.SpacerLarge />
        </ResponsiveWrapper>
        <hr style={{
          color: '#000000',
          backgroundColor: '#000000',
          height: '5px',
          borderColor: '#000000',
          width:'100%'
        }} />
        <s.SpacerLarge />
        <s.Container flex={1} jc={"center"} ai={"center"} fd={"row"}>
          <h2 style={{
            fontSize: '35px',
            fontWeight: 'bold',
            borderBottom: '6px solid var(--primary)',
            borderRadius: '4px'

          }}>Your Collection </h2>
          <StyledRoundButton2
            onClick={(e) => {
              e.preventDefault();
              getNFTData();
            }}
          >
            <svg
              className="icon"
              height="20"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m23.8995816 10.3992354c0 .1000066-.1004184.1000066-.1004184.2000132 0 0 0 .1000066-.1004184.1000066-.1004184.1000066-.2008369.2000132-.3012553.2000132-.1004184.1000066-.3012552.1000066-.4016736.1000066h-6.0251046c-.6025105 0-1.0041841-.4000264-1.0041841-1.00006592 0-.60003954.4016736-1.00006591 1.0041841-1.00006591h3.5146443l-2.8117154-2.60017136c-.9037657-.90005932-1.9079498-1.50009886-3.0125523-1.90012523-2.0083682-.70004614-4.2175733-.60003954-6.12552305.30001977-2.0083682.90005932-3.41422594 2.50016478-4.11715481 4.5002966-.20083682.50003295-.80334728.80005275-1.30543933.60003954-.50209205-.10000659-.80334728-.70004613-.60251046-1.20007909.90376569-2.60017136 2.71129707-4.60030318 5.12133891-5.70037568 2.41004184-1.20007909 5.12133894-1.30008569 7.63179914-.40002637 1.4058578.50003296 2.7112971 1.30008569 3.7154812 2.40015819l3.0125523 2.70017795v-3.70024386c0-.60003955.4016736-1.00006591 1.0041841-1.00006591s1.0041841.40002636 1.0041841 1.00006591v6.00039545.10000662c0 .1000066 0 .2000132-.1004184.3000197zm-3.1129707 3.7002439c-.5020921-.2000132-1.1046025.1000066-1.3054394.6000396-.4016736 1.1000725-1.0041841 2.200145-1.9079497 3.0001977-1.4058578 1.5000989-3.5146444 2.3001516-5.623431 2.3001516-2.10878662 0-4.11715482-.8000527-5.72384938-2.4001582l-2.81171548-2.6001714h3.51464435c.60251046 0 1.0041841-.4000263 1.0041841-1.0000659 0-.6000395-.40167364-1.0000659-1.0041841-1.0000659h-6.0251046c-.10041841 0-.10041841 0-.20083682 0s-.10041841 0-.20083682 0c0 0-.10041841 0-.10041841.1000066-.10041841 0-.20083682.1000066-.20083682.2000132s0 .1000066-.10041841.1000066c0 .1000066-.10041841.1000066-.10041841.2000132v.2000131.1000066 6.0003955c0 .6000395.40167364 1.0000659 1.0041841 1.0000659s1.0041841-.4000264 1.0041841-1.0000659v-3.7002439l2.91213389 2.8001846c1.80753138 2.0001318 4.31799163 3.0001977 7.02928871 3.0001977 2.7112971 0 5.2217573-1.0000659 7.1297071-2.9001911 1.0041841-1.0000659 1.9079498-2.3001516 2.4100418-3.7002439.1004185-.6000395-.2008368-1.2000791-.7029288-1.3000857z"
                transform=""
              />
            </svg>
          </StyledRoundButton2>
        </s.Container>
        <s.SpacerLarge />
        <s.Container className="nft-container" st flex={1} jc={"center"} ai={"center"} fd={"row"}>
          {renderNFTs()}
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
