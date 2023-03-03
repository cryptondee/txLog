import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import Web3 from "web3";
import { Alchemy, Network, AlchemySubscription, Utils } from "alchemy-sdk";
import React, { useState, useEffect, cloneElement } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const abi = [
    {
      inputs: [
        { internalType: "address", name: "_factory", type: "address" },
        { internalType: "address", name: "_WETH", type: "address" },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "WETH",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "tokenA", type: "address" },
        { internalType: "address", name: "tokenB", type: "address" },
        { internalType: "uint256", name: "amountADesired", type: "uint256" },
        { internalType: "uint256", name: "amountBDesired", type: "uint256" },
        { internalType: "uint256", name: "amountAMin", type: "uint256" },
        { internalType: "uint256", name: "amountBMin", type: "uint256" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "deadline", type: "uint256" },
      ],
      name: "addLiquidity",
      outputs: [
        { internalType: "uint256", name: "amountA", type: "uint256" },
        { internalType: "uint256", name: "amountB", type: "uint256" },
        { internalType: "uint256", name: "liquidity", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "token", type: "address" },
        {
          internalType: "uint256",
          name: "amountTokenDesired",
          type: "uint256",
        },
        { internalType: "uint256", name: "amountTokenMin", type: "uint256" },
        { internalType: "uint256", name: "amountETHMin", type: "uint256" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "deadline", type: "uint256" },
      ],
      name: "addLiquidityETH",
      outputs: [
        { internalType: "uint256", name: "amountToken", type: "uint256" },
        { internalType: "uint256", name: "amountETH", type: "uint256" },
        { internalType: "uint256", name: "liquidity", type: "uint256" },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "factory",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "amountIn", type: "uint256" },
        { internalType: "address[]", name: "path", type: "address[]" },
      ],
      name: "getAmountsOut",
      outputs: [
        { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "token1", type: "address" },
        { internalType: "address", name: "token2", type: "address" },
      ],
      name: "getPair",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "amountA", type: "uint256" },
        { internalType: "uint256", name: "reserveA", type: "uint256" },
        { internalType: "uint256", name: "reserveB", type: "uint256" },
      ],
      name: "quote",
      outputs: [{ internalType: "uint256", name: "amountB", type: "uint256" }],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "tokenA", type: "address" },
        { internalType: "address", name: "tokenB", type: "address" },
        { internalType: "uint256", name: "liquidity", type: "uint256" },
        { internalType: "uint256", name: "amountAMin", type: "uint256" },
        { internalType: "uint256", name: "amountBMin", type: "uint256" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "deadline", type: "uint256" },
      ],
      name: "removeLiquidity",
      outputs: [
        { internalType: "uint256", name: "amountA", type: "uint256" },
        { internalType: "uint256", name: "amountB", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "token", type: "address" },
        { internalType: "uint256", name: "liquidity", type: "uint256" },
        { internalType: "uint256", name: "amountTokenMin", type: "uint256" },
        { internalType: "uint256", name: "amountETHMin", type: "uint256" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "deadline", type: "uint256" },
      ],
      name: "removeLiquidityETH",
      outputs: [
        { internalType: "uint256", name: "amountToken", type: "uint256" },
        { internalType: "uint256", name: "amountETH", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "token", type: "address" },
        { internalType: "uint256", name: "liquidity", type: "uint256" },
        { internalType: "uint256", name: "amountTokenMin", type: "uint256" },
        { internalType: "uint256", name: "amountETHMin", type: "uint256" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "deadline", type: "uint256" },
      ],
      name: "removeLiquidityETHSupportingFeeOnTransferTokens",
      outputs: [
        { internalType: "uint256", name: "amountETH", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "token", type: "address" },
        { internalType: "uint256", name: "liquidity", type: "uint256" },
        { internalType: "uint256", name: "amountTokenMin", type: "uint256" },
        { internalType: "uint256", name: "amountETHMin", type: "uint256" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "deadline", type: "uint256" },
        { internalType: "bool", name: "approveMax", type: "bool" },
        { internalType: "uint8", name: "v", type: "uint8" },
        { internalType: "bytes32", name: "r", type: "bytes32" },
        { internalType: "bytes32", name: "s", type: "bytes32" },
      ],
      name: "removeLiquidityETHWithPermit",
      outputs: [
        { internalType: "uint256", name: "amountToken", type: "uint256" },
        { internalType: "uint256", name: "amountETH", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "token", type: "address" },
        { internalType: "uint256", name: "liquidity", type: "uint256" },
        { internalType: "uint256", name: "amountTokenMin", type: "uint256" },
        { internalType: "uint256", name: "amountETHMin", type: "uint256" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "deadline", type: "uint256" },
        { internalType: "bool", name: "approveMax", type: "bool" },
        { internalType: "uint8", name: "v", type: "uint8" },
        { internalType: "bytes32", name: "r", type: "bytes32" },
        { internalType: "bytes32", name: "s", type: "bytes32" },
      ],
      name: "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens",
      outputs: [
        { internalType: "uint256", name: "amountETH", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "tokenA", type: "address" },
        { internalType: "address", name: "tokenB", type: "address" },
        { internalType: "uint256", name: "liquidity", type: "uint256" },
        { internalType: "uint256", name: "amountAMin", type: "uint256" },
        { internalType: "uint256", name: "amountBMin", type: "uint256" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "deadline", type: "uint256" },
        { internalType: "bool", name: "approveMax", type: "bool" },
        { internalType: "uint8", name: "v", type: "uint8" },
        { internalType: "bytes32", name: "r", type: "bytes32" },
        { internalType: "bytes32", name: "s", type: "bytes32" },
      ],
      name: "removeLiquidityWithPermit",
      outputs: [
        { internalType: "uint256", name: "amountA", type: "uint256" },
        { internalType: "uint256", name: "amountB", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "amountOutMin", type: "uint256" },
        { internalType: "address[]", name: "path", type: "address[]" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "address", name: "referrer", type: "address" },
        { internalType: "uint256", name: "deadline", type: "uint256" },
      ],
      name: "swapExactETHForTokensSupportingFeeOnTransferTokens",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "amountIn", type: "uint256" },
        { internalType: "uint256", name: "amountOutMin", type: "uint256" },
        { internalType: "address[]", name: "path", type: "address[]" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "address", name: "referrer", type: "address" },
        { internalType: "uint256", name: "deadline", type: "uint256" },
      ],
      name: "swapExactTokensForETHSupportingFeeOnTransferTokens",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "amountIn", type: "uint256" },
        { internalType: "uint256", name: "amountOutMin", type: "uint256" },
        { internalType: "address[]", name: "path", type: "address[]" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "address", name: "referrer", type: "address" },
        { internalType: "uint256", name: "deadline", type: "uint256" },
      ],
      name: "swapExactTokensForTokensSupportingFeeOnTransferTokens",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    { stateMutability: "payable", type: "receive" },
  ];
  const [transactions, setTransactions] = useState([]);
  const [toAddress, setToAddress] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [wsEnabled, setWsEnabled] = useState(false);
  const [text, setText] = useState(
    "not watching, input address and press enter"
  );
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
            from: fromAddress, //own address
            to: toAddress, //0xc873fEcbd354f5A56E00E710B90EF4201db2448d
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

  const handleInputChangeTo = (event) => {
    setToAddress(event.target.value);
    setWsEnabled(false);
  };
  const handleInputChangeFrom = (event) => {
    setFromAddress(event.target.value);
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
    <div className="h-screen bg-gradient-to-r from-purple-600 to-blue-600 flex flex-col justify-center items-center">
      <h1 className="text-4xl text-white mb-8">
        {text} - {checkNetwork}
      </h1>
      <form onSubmit={handleSubmit} className="w-1/2">
        <div className="mb-4">
          <label
            htmlFor="to-address-input"
            className="block text-white font-bold mb-2"
          >
            Address to listen to:
          </label>
          <input
            type="text"
            id="to-address-input"
            value={toAddress}
            onChange={handleInputChangeTo}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="from-address-input"
            className="block text-white font-bold mb-2"
          >
            Address from listen to:
          </label>
          <input
            type="text"
            id="from-address-input"
            value={fromAddress}
            onChange={handleInputChangeFrom}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Listen
        </button>
      </form>
      <div className="flex justify-center items-center mt-8">
        <p className="text-white font-bold mr-4">Network:</p>
        <label className="inline-flex items-center mr-4">
          <input
            type="radio"
            name="network"
            value={Network.ARB_MAINNET}
            checked={checkNetwork === Network.ARB_MAINNET}
            onChange={handleNetworkChange}
            className="form-radio h-5 w-5 text-blue-600"
          />
          <span className="ml-2 text-white font-bold">ARB Mainnet</span>
        </label>
        <label className="inline-flex items-center mr-4">
          <input
            type="radio"
            name="network"
            value={Network.ETH_MAINNET}
            checked={checkNetwork === Network.ETH_MAINNET}
            onChange={handleNetworkChange}
            className="form-radio h-5 w-5 text-blue-600"
          />
          <span className="ml-2 text-white font-bold">ETH Mainnet</span>
        </label>
        <label className="inline-flex items-center mr-4">
          <input
            type="radio"
            name="network"
            value={Network.OPT_MAINNET}
            checked={checkNetwork === Network.OPT_MAINNET}
            onChange={handleNetworkChange}
            className="form-radio h-5 w-5 text-blue-600"
          />
          <span className="ml-2 text-white font-bold">Optimism</span>
        </label>
      </div>
      <div className="mt-8 w-1/2">
        {transactions.length > 0 ? (
          transactions.map((tx) => (
            <div
              className="bg-white shadow rounded-lg mb-4 p-4"
              key={tx.transaction.hash}
            >
              <p className="font-bold">Hash:</p>
              <p className="text-gray-700">{tx.transaction.hash}</p>
              <p className="font-bold mt-2">From:</p>
              <p className="text-gray-700">{tx.transaction.from}</p>
              <p className="font-bold mt-2">To:</p>
              <p className="text-gray-700">{tx.transaction.to}</p>
              <p className="font-bold mt-2">Value:</p>
              <p className="text-gray-700">{tx.transaction.value}</p>
              <p className="font-bold mt-2">Input:</p>
              <p className="text-gray-700">{tx.transaction.input}</p>
            </div>
          ))
        ) : (
          <p>No transactions to show</p>
        )}
      </div>
    </div>
  );
}
