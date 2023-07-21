const cache = require("memory-cache");

const { getTotalSupply, getGameTokenPrice } = require("./web3");

require("dotenv").config();

const { GAME_TOKEN_CONTRACT_ADDRESS } = process.env;

const COMMANDS = {
  PING: "ping",
  ADDRESS: "address",
  PRICE: "price",
  SUPPLY: "supply",
  INSTALL: "install",
  WEBPAGE: "webpage",
  HELP: "help",
};

const CACHE_KEYS = {
  PRICE: "price",
  SUPPLY: "supply",
};

const tokenCommands = [
  { command: COMMANDS.ADDRESS, description: "Get the game token address" },
  {
    command: COMMANDS.PRICE,
    description: "Get the current price of the game token",
  },
  {
    command: COMMANDS.SUPPLY,
    description: "Get the circulating supply of the game token",
  },
];

const gameCommands = [
  {
    command: COMMANDS.INSTALL,
    description: "Get the links to install the game",
  },
  {
    command: COMMANDS.WEBPAGE,
    description: "Get the web page of the game",
  },
];

// Adding bot
const INTRO_MESSAGE =
  "Hi, I am the official Mythic Odyssey Telegram Helper Bot";

// Ping
const PING_REPLY = "Mythic Odyssey Helper Bot is up!";

// Game Token Address
const nextTokenAddress = `[${GAME_TOKEN_CONTRACT_ADDRESS}](https://mumbai.polygonscan.com/address/${GAME_TOKEN_CONTRACT_ADDRESS})`;
const GAME_ADDRESS_REPLY = `The game token address is ${nextTokenAddress}`;

// Price
const returnTokenPrice = async () => {
  const cachedPrice = cache.get(CACHE_KEYS.PRICE);
  if (cachedPrice) {
    return `The current price is US$${cachedPrice}`;
  }

  const price = await getGameTokenPrice();
  const nextPrice = price.replace(".", "\\.");
  // Cache the price for future requests
  cache.put(CACHE_KEYS.PRICE, nextPrice, 30 * 1000); // 30 seconds
  return `The current price is US$${nextPrice}`;
};

// Supply
const returnTokenSupply = async () => {
  const cachedSupply = cache.get(CACHE_KEYS.SUPPLY);
  if (cachedSupply) {
    return `The total supply is ${cachedSupply}`;
  }

  const totalSupply = await getTotalSupply();
  const nextTotalSupply = totalSupply.replace(".", "\\.");
  // Cache the supply for future requests
  cache.put(CACHE_KEYS.SUPPLY, nextTotalSupply, 30 * 1000); // 30 seconds
  return `The total supply is ${nextTotalSupply}`;
};

// Install links
const INSTALL_LINKS = `You can install the game at the following links:\n\n🤖 Android: [Play Store Link to be inserted]\n\n🍎 Apple: [Apple Link to be inserted] `;

// Webpage link
const WEBPAGE_LINK = `You can access the webpage here: https://xy3-web3.vercel.app/`;

const getCommandListString = (commandsList) => {
  return commandsList
    .map((cmd) => `\\- /${cmd.command} \\- ${cmd.description}`)
    .join("\n");
};

// Help

const HELP_HEADER = "Hi, I can provide info on the following matters:";

const HELP_PING_SECTION = `⚡️ ${COMMANDS.PING}:\n\\- /ping: Check if the Bot is up\n\n`;

const HELP_TOKEN_COMMANDS_LIST = getCommandListString(tokenCommands);
const HELP_TOKEN_SECTION = `🎮 Token:\n${HELP_TOKEN_COMMANDS_LIST}\n\n`;

const HELP_GAME_COMMANDS_LIST = getCommandListString(gameCommands);
const HELP_GAME_SECTION = `🎲 Game:\n${HELP_GAME_COMMANDS_LIST}\n\n`;

const HELP_SECTION = `❓ Help:\n\\- /${COMMANDS.HELP}: Get available commands for the bot`;

const HELP_MESSAGE = `${HELP_HEADER}\n\n${HELP_PING_SECTION}${HELP_TOKEN_SECTION}${HELP_GAME_SECTION}${HELP_SECTION}`;

module.exports = {
  COMMANDS,
  CACHE_KEYS,
  INTRO_MESSAGE,
  PING_REPLY,
  GAME_ADDRESS_REPLY,
  INSTALL_LINKS,
  WEBPAGE_LINK,
  HELP_MESSAGE,
  tokenCommands,
  gameCommands,
  returnTokenPrice,
  returnTokenSupply,
};
