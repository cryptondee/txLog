import { Alchemy, Network, AlchemySubscription } from "alchemy-sdk";
import React, { useState, useEffect } from "react";

function Test() {
  const [transactions, setTransactions] = useState([]);
  const [toAddress, setToAddress] = useState();
  const [wsEnabled, setWsEnabled] = useState(false);
  const [text, setText] = useState("not watching");

  const getTransactions = async () => {
    const config = {
      apiKey: process.env.alchemyApi,
      network: Network.ARB_MAINNET,
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
  }, [toAddress, wsEnabled]);
  const handleInputChange = (event) => {
    setToAddress(event.target.value);
    setWsEnabled(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setWsEnabled(true);
  };

  return (
    <div>
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
        <p>{text}</p>
      )}
    </div>
  );
}

export default Test;
