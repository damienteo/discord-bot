const { ethers } = require("ethers");

const formatTokenValue = (value, decimals) => {
  return ethers.formatUnits(value, decimals || 18);
};

const formatNumberValue = (value) => {
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(2) + "MM";
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(2) + "K";
  } else {
    const nextValue = value.toFixed(4);
    return parseFloat(nextValue).toString();
  }
};

module.exports = {
  formatTokenValue,
  formatNumberValue,
};
