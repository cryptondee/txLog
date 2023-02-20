import { Alchemy, Network, AlchemySubscription } from "alchemy-sdk";
import React, { useState, useEffect } from "react";

function Test() {
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
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
              to: "0x87898B0d8aB25F5034e045d056027647C5494584",
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

    getTransactions();
  }, []);
  return (
    <div>
      {transactions.length > 0 ? (
        transactions.map((tx) => (
          <div key={tx.hash}>
            <p>Hash: {tx.transaction.hash}</p>
            <p>From: {tx.transaction.from}</p>
            <p>To: {tx.transaction.to}</p>
            <p>Value: {tx.transaction.value}</p>
          </div>
        ))
      ) : (
        <p>No transactions yet.</p>
      )}
    </div>
  );
}

export default Test;
