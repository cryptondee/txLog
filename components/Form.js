import { Alchemy, Network, AlchemySubscription } from "alchemy-sdk";
import React, { useState, useEffect } from "react";

function Form() {
  const [transactions, setTransactions] = useState([]);
  const [toAddress, setToAddress] = useState();
  const [wsEnabled, setWsEnabled] = useState(false);
  const [text, setText] = useState("not watching");
  const [checkNetwork, setCheckNetwork] = useState(Network.ARB_MAINNET);

  const getTransactions = async () => {
    const config = {
      apiKey: process.env.alchemyApi,
      network: checkNetwork,
    };
    const alchemy = new Alchemy(config);

    alchemy.ws.on(
      {
        method: AlchemySubscription.MINED_TRANSACTIONS,
        addresses: [
          {
            to: toAddress,
          },
        ],
        includeRemoved: true,
        hashesOnly: false,
      },
      (tx) => {
        console.log(tx);
        setTransactions((prevTx) => [...prevTx, tx]);
      }
    );
  };

  useEffect(() => {
    if (!wsEnabled) {
      return;
    }

    getTransactions();
    setText("Watching");
  }, [toAddress, wsEnabled, checkNetwork]);

  const handleInputChange = (event) => {
    setToAddress(event.target.value);
    setWsEnabled(false);
  };
  const handleNetworkChange = (event) => {
    setCheckNetwork(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setWsEnabled(true);
  };

  return (
    <div>
      {text} - {checkNetwork}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="to-address-input">To Address:</label>
          <input
            type="text"
            id="to-address-input"
            value={toAddress}
            onChange={handleInputChange}
          />
        </div>
      </form>
      <div>
        <p>Network:</p>
        <label>
          <input
            type="radio"
            name="network"
            value={Network.ARB_MAINNET}
            checked={checkNetwork === Network.ARB_MAINNET}
            onChange={handleNetworkChange}
          />
          ARB Mainnet
        </label>
        <label>
          <input
            type="radio"
            name="network"
            value={Network.ETH_MAINNET}
            checked={checkNetwork === Network.ETH_MAINNET}
            onChange={handleNetworkChange}
          />
          ETH Mainnet
        </label>
      </div>
      {transactions.length > 0 ? (
        transactions.map((tx) => (
          <div key={tx.transaction.hash}>
            <p>Hash: {tx.transaction.hash}</p>
            <p>From: {tx.transaction.from}</p>
            <p>To: {tx.transaction.to}</p>
            <p>Value: {tx.transaction.value}</p>
          </div>
        ))
      ) : (
        <p>No tx</p>
      )}
    </div>
  );
}

export default Form;
