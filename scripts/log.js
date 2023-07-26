const express = require("express");
const { ApolloClient, InMemoryCache, gql } = require("@apollo/client");
const app = express();
const port = process.env.PORT || 3000;

const APIURL = "https://api.studio.thegraph.com/query/50250/test/v0.1.1";

const tokensQuery = `
    {
      students(first: 10, where: { status_not: "removed" }) {
        studentId
        name
        age
        status
      }
    }
  `;

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

app.get("/api", (req, res) => {
  // Replace this JSON message with your desired response
  client
    .query({
      query: gql(tokensQuery),
    })
    .then((data) => {
      console.log("Subgraph data: ", data);
      // Send the JSON response
      res.json(data);
    })
    .catch((err) => {
      console.log("Error fetching data: ", err);
    });
});

app.listen(port);
console.log("listening on", port);
