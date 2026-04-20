import crypto from "crypto";
import net from "net";

net
  .createServer((socket) => {
    socket.on("data", (data) => {
      const { message, signature, publicKey } = JSON.parse(data.toString());

      //verify signature
      const isVerified = crypto.verify(
        "sha256",
        Buffer.from(message),
        publicKey,
        Buffer.from(signature, "hex"),
      );

      console.log(`\n--- Incoming Data----`);
      console.log(`message: ${message}`);
      console.log(`Result: ${isVerified ? "VALID" : "INVALID (Tampered)"}`);
    });
  })
  .listen(3003, () =>
    console.log("App3 receiver is listening on port 3003...."),
  );
