const axios = require("axios").default;
const nacl = require("tweetnacl");

import {
  COMMANDS,
  PING_REPLY,
  GAME_ADDRESS_REPLY,
  INSTALL_LINKS,
  WEBPAGE_LINK,
  HELP_MESSAGE,
  returnTokenPrice,
  returnTokenSupply,
} from "./utils/replies";

const INTERACTIONS_URL = `https://discord.com/api/v10/interactions`;

const initialReplyObject = {
  // Note the absence of statusCode
  type: 4, // This type stands for answer with invocation shown
  // data: { content: "bar" },
};

exports.handler = async (event) => {
  console.log("------------INCOMING REQUEST---------------");
  // Checking signature (requirement 1.)
  // Your public key can be found on your application in the Developer Portal
  const PUBLIC_KEY = process.env.PUBLIC_KEY;
  const signature =
    event.headers["x-signature-ed25519"] ||
    event.headers["X-Signature-Ed25519"];
  const timestamp =
    event.headers["x-signature-timestamp"] ||
    event.headers["X-Signature-Timestamp"];
  const strBody = event.body; // should be string, for successful sign

  const isVerified = nacl.sign.detached.verify(
    Buffer.from(timestamp + strBody),
    Buffer.from(signature, "hex"),
    Buffer.from(PUBLIC_KEY, "hex")
  );

  if (!isVerified) {
    return {
      statusCode: 401,
      body: JSON.stringify("invalid request signature"),
    };
  }

  // Replying to ping (requirement 2.)
  const body = JSON.parse(strBody);
  console.log({ body });
  if (body.type == 1) {
    return {
      statusCode: 200,
      body: JSON.stringify({ type: 1 }),
    };
  }

  const interactionId = body.id;
  const interactionToken = body.token;
  const interactionUrl = `${INTERACTIONS_URL}/${interactionId}/${interactionToken}/callback`;

  let replyObject;

  switch (body.data.name) {
    case COMMANDS.ADDRESS:
      replyObject = {
        ...initialReplyObject,
        data: { content: GAME_ADDRESS_REPLY },
      };
      await axios.post(interactionUrl, replyObject);
      return JSON.stringify(replyObject);
      break;
    case COMMANDS.HELP:
      replyObject = {
        ...initialReplyObject,
        data: { content: HELP_MESSAGE },
      };
      await axios.post(interactionUrl, replyObject);
      return JSON.stringify(replyObject);
    case COMMANDS.INSTALL:
      replyObject = {
        ...initialReplyObject,
        data: { content: INSTALL_LINKS },
      };
      await axios.post(interactionUrl, replyObject);
      return JSON.stringify(replyObject);
    case COMMANDS.PING:
      replyObject = {
        ...initialReplyObject,
        data: { content: PING_REPLY },
      };
      await axios.post(interactionUrl, replyObject);
      return JSON.stringify(replyObject);
    case COMMANDS.PRICE:
      const priceReply = await returnTokenPrice();
      replyObject = {
        ...initialReplyObject,
        data: { content: priceReply },
      };
      await axios.post(interactionUrl, replyObject);
      return JSON.stringify(replyObject);
    case COMMANDS.SUPPLY:
      const supplyReply = await returnTokenSupply();
      replyObject = {
        ...initialReplyObject,
        data: { content: supplyReply },
      };
      await axios.post(interactionUrl, replyObject);
      return JSON.stringify(replyObject);
    case COMMANDS.WEBPAGE:
      replyObject = {
        ...initialReplyObject,
        data: { content: WEBPAGE_LINK },
      };
      await axios.post(interactionUrl, replyObject);
      return JSON.stringify(replyObject);
    default:
      return {
        statusCode: 404, // If no handler implemented for Discord's request
      };
  }
};
