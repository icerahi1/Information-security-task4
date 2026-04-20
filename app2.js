import net from "net";
import readline from "readline";

net
  .createConnection((clientSocket) => {
    clientSocket.on("data", (data) => {
      let payload = JSON.parse(data.toString());
      console.log(`\nIntercepted message: ${payload.message}`);
      console.log(
        `Intercepted signature: ${payload.signature.substring(0, 20)}...`,
      );

      readline.question(
        "\n[Attacker] Enter a fake signature or press enter to press original: ",
        (fakeSig) => {
          if (fakeSig) payload.signature = fakeSig; // tampering

          //forward to app3
          const toApp3 = net.createConnection({ port: 3003 }, () => {
            toApp3.write(JSON.stringify(payload));
            toApp3.end();
          });
        },
      );
    });
  })
  .listen(3002, () => console.log("App 2 (Proxy) listening on port 3002...."));
