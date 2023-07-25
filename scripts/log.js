// const express = require("express");
// const { createClient } = require("urql");
// const app = express();
// const port = process.env.PORT || 3000;

// const APIURL =
//   "https://api.studio.thegraph.com/query/50250/test/version/latest";

// const tokensQuery = `
//   query {
//     addeds(first: 5) {
//       id
//       name
//       age
//       blockNumber
//     }
//   }
// `;

// const client = createClient({
//   url: APIURL,
// });

// app.get("/api", (req, res) => {
//   // Replace this JSON message with your desired response
//   let data = {};
//   const main = async () => {
//     data = await client.query(tokensQuery).toPromise();
//   };
//   main();
//   const message = {
//     message: "Hello, this is a simple GET API response!",
//   };
//   // Send the JSON response
//   res.json(data);
// });

// app.listen(port);
// console.log("listening on", port);

const { ApolloClient, InMemoryCache, gql } = require("@apollo/client");

const APIURL =
  "https://api.studio.thegraph.com/query/50250/test/version/latest";

const tokensQuery = `
    query {
      addeds(first: 5) {
        id
        name
        age
        blockNumber
      }
    }
  `;

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

client
  .query({
    query: gql(tokensQuery),
  })
  .then((data) => console.log("Subgraph data: ", data))
  .catch((err) => {
    console.log("Error fetching data: ", err);
  });
