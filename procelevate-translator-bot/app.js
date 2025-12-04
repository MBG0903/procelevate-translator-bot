const express = require("express");
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");
const speechSdk = require("microsoft-cognitiveservices-speech-sdk");

const app = express();
const credential = new DefaultAzureCredential();
const vaultName = "kv-procelevate-translate";
const url = `https://${vaultName}.vault.azure.net`;
const client = new SecretClient(url, credential);

async function getSpeechConfig() {
  const key = await client.getSecret("speech-key");
  const region = await client.getSecret("speech-region");
  return speechSdk.SpeechConfig.fromSubscription(key.value, region.value);
}

app.get("/", async (req, res) => {
  try {
    const speechConfig = await getSpeechConfig();
    res.send("✅ Translator bot is connected to Azure Speech API!");
  } catch (err) {
    console.error("Error fetching secrets:", err.message);
    res.status(500).send("❌ Failed to connect to Speech API.");
  }
});

module.exports = app;

