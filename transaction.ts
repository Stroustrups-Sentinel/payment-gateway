// customer initializes transaction

const SECRET_KEY = "sk_test_7c1ff05caa0afd9681ff1f7b86a0c2d303687b05";

import * as https from "https";

const params = JSON.stringify({
  email: "customer@email.com",
  amount: "20000",
  currency: "NGN",
});

function initTransaction(SECRET_KEY, params) {
  // bundle up request
  const options: https.RequestOptions = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transaction/initialize",
    method: "POST",
    headers: {
      Authorization: "Bearer " + SECRET_KEY,
      "Content-Type": "application/json",
    },
  };

  // setting up  the request variable
  const req = https
    .request(options, (res) => {
      let data = "";

      // get data during steaming of response
      res.on("data", (chunk) => {
        data += chunk;
      });

      // when finished getting the data
      res.on("end", () => {
        // console.log(JSON.parse(data));
        let parsedData = JSON.parse(data); // ! PRECAUTION: please make sure to add a null/bad data exception 
        console.log(parsedData);

        console.log("[i] REQUEST COMPLETE");

        //TODO Add database transaction record here

        // * verifying request
        console.log("[*] REFERENCE_CODE: " + parsedData.data.reference);
        verifyTransaction(SECRET_KEY,parsedData.data.reference);
      });
    })
    .on("error", (error) => {
      // in case o f an error
      console.error(error);
    });

  req.write(params); // starts the request
  req.end(); // ends the request
}

function verifyTransaction(SECRET_KEY, reference) {
  const options: https.RequestOptions = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transaction/verify/:" + reference,
    method: "GET",
    headers: {
      Authorization: "Bearer "+ SECRET_KEY,
    },
  };

  https
    .request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        console.log(JSON.parse(data));
        console.log("[i]TRANSACTION HAS BEEN REFERENCED !");

        // TODO add transaction verification to DB
      });
    })
    .on("error", (error) => {
      console.error(error);
    });
}

// make payment
//
// customer views transaction

// --------------------
// EXECUTE HERE
// ----------------------

initTransaction(SECRET_KEY, params);
