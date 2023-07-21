require("dotenv").config();
const axios = require("axios").default;

const { APP_ID, BOT_TOKEN, GUILD_ID } = process.env;

let url = `https://discord.com/api/v8/applications/${APP_ID}/guilds/${GUILD_ID}/commands`;

const headers = {
  Authorization: `Bot ${BOT_TOKEN}`,
  "Content-Type": "application/json",
};

let command_data = {
  name: "foo",
  type: 1,
  description: "replies with bar ;/",
};

axios.post(url, JSON.stringify(command_data), {
  headers: headers,
});
