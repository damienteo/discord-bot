import { ethers } from "ethers";

import { formatTokenValue, formatNumberValue } from "./common";

require("dotenv").config();

const {
  abi: QuoterABI,
} = require("@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json");

const {
  GAME_TOKEN_CONTRACT_ADDRESS,
  UNISWAP_V3_QUOTER_ADDRESS,
  USD_TOKEN_ADDRESS,
  ALCHEMY_API_KEY,
} = process.env;
const provider = new ethers.JsonRpcProvider(ALCHEMY_API_KEY);

const gameTokenAddress = GAME_TOKEN_CONTRACT_ADDRESS;
const usdTokenAddress = USD_TOKEN_ADDRESS;
const quoterAddress = UNISWAP_V3_QUOTER_ADDRESS;

export const getTotalSupply = async () => {
  const tokenContract = new ethers.Contract(
    gameTokenAddress,
    ["function totalSupply() view returns (uint256)"],
    provider
  );
  const totalSupply = await tokenContract.totalSupply();
  const nextSupply = formatTokenValue(totalSupply);
  return formatNumberValue(Number(nextSupply));
};

// https://docs.uniswap.org/sdk/v3/guides/quoting
export const getGameTokenPrice = async () => {
  // We already know, based on the pool address,
  // which token is token0 and token1
  // So there is no need for additional calls to get token decimals
  const tokenDecimals0 = 6; // Currently TUSD
  const tokenDecimals1 = 18; // Currently FRG

  const quoterContract = new ethers.Contract(
    quoterAddress,
    QuoterABI,
    provider
  );

  const amountIn = ethers.parseUnits("1", tokenDecimals1);

  // Likewise, we know ahead of time the variables going into the quote
  const quotedAmountOut = await quoterContract.quoteExactInputSingle.staticCall(
    gameTokenAddress, // in
    usdTokenAddress, // out
    10000, // fee
    amountIn, // amount in
    "0"
  );

  const amountOut = ethers.formatUnits(quotedAmountOut, tokenDecimals0);

  return amountOut;
};
