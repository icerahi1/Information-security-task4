import crypto from "crypto";
import net from "net";
import readline from "readline";

const readline = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//generate rsa keys

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

readline.question("Enter message to send: ", (message) => {
  //hash and sign the message
  const signature = crypto
    .sign("sha256", Buffer.from(message), privateKey)
    .toString("hex");
  const payload = JSON.stringify({ message, signature, publicKey });

  // send to app2
  const toApp2 = net.createConnection({ port: 3002 }, () => {
    toApp2.write(payload);
    toApp2.end();
    console.log("Message signed and set to network!");
    process.exit();
  });
});
