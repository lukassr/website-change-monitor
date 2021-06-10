/* eslint-disable no-console */
/* eslint-disable no-lonely-if */
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

// Express configuration
const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 3000;

// Main configuration variables
const urlToCheck1 = 'https://bip.cl/tarjeta-de-video-msi-rtx-3070-ventus-2x-oc-8gb-gddr6-256-bit-220w-displayport-hdmi-geforcertx3070ventus2xoc_28488';
const elementsToSearchFor1 = ['Comprar ahora'];
const urlToCheck2 = 'https://bip.cl/tarjeta-de-video-zotac-geforce-rtx-3070-twin-edge-oc-8gb-gddr6-256-bit-14-gbps-pcie-40-zt-a30700h-10p_28509';
const elementsToSearchFor2 = ['Comprar ahora'];
const urlToCheck3 = 'https://www.pclinkstore.cl/tarjeta-de-video-asus-geforce-rtxTM-%EF%B8%8F3070-oc-edition-8gb-gddr6-dual-rtx3070-o8g';
const elementsToSearchFor3 = ['Agregar al Carro'];
const urlToCheck4 = 'https://www.pclinkstore.cl/tarjeta-de-video-asus-dual-rtx-3060-12gb';
const elementsToSearchFor4 = ['Agregar al Carro'];
const urlToCheck5 = 'https://www.pclinkstore.cl/tarjeta-de-video-zotac-rtx3070-twin-edge-oc-8gb-gddr6x';
const elementsToSearchFor5 = ['Agregar al Carro'];
const urlToCheck6 = 'https://www.pclinkstore.cl/tarjeta-de-video-zotac-rtx3060-twin-edge-oc-12gb-gddr6-oczt-a30600h-10m';
const elementsToSearchFor6 = ['Agregar al Carro'];

const checkingFrequency = 1 * 60000; // first number represent the checkingFrequency in minutes

// Slack Integration
const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';
const slack = require('slack-notify')(SLACK_WEBHOOK_URL);

// SendGrid Email Integration
// const SENDGRID_APY_KEY = 'AA.AAAA_AAAAAAAAAAAAA.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
// const sgMail = require('@sendgrid/mail');

// sgMail.setApiKey(SENDGRID_APY_KEY);
// const emailFrom = 'aaa@aaa.com';
// const emailsToAlert = ['emailOneToSend@theAlert.com', 'emailTwoToSend@theAlert.com'];

const checkingNumberBeforeWorkingOKEmail = 1440
/ (checkingFrequency / 60000); // 1 day = 1440 minutes
let requestCounter = 0;

function getResponse(url, elements) {
  request(url, (err, response, body) => {
    // if the request fail
    if (err) {
      console.log(`Request Error - ${err}`);
    } else {
      // if the target-page content is empty
      if (!body) {
        console.log(`Request Body Error - ${err}`);
      }
      // if the request is successful
      else {
        // if any elementsToSearchFor exist
        if (elements.some(el => body.includes(el))) {
          // Slack Alert Notification
          slack.alert(`🔥🔥🔥  <${url}/|Change detected in ${url}>  🔥🔥🔥 `, (error) => {
            if (error) {
              console.log('Slack API error:', error);
            } else {
              console.log('Message received in slack!');
            }
          });

          // Email Alert Notification
          // const msg = {
          //   to: emailsToAlert,
          //   from: emailFrom,
          //   subject: `🔥🔥🔥 Change detected in ${urlToCheck} 🔥🔥🔥`,
          //   html: `Change detected in <a href="${urlToCheck}"> ${urlToCheck} </a>  `,
          // };
          // sgMail.send(msg)
          //   .then(() => { console.log('Alert Email Sent!'); })
          //   .catch((emailError) => { console.log(emailError); });
        }
      }
    }
  });
}

function sendSlackMessage() {
  slack.alert('✅ Website Change Monitor is working OK ✅', (err) => {
    if (err) {
      console.log('Slack API error:', err);
    } else {
      console.log('Message received in slack!');
    }
  });
}

// Main function
setInterval(() => {
  getResponse(urlToCheck1, elementsToSearchFor1);
  getResponse(urlToCheck2, elementsToSearchFor2);
  getResponse(urlToCheck3, elementsToSearchFor3);
  getResponse(urlToCheck4, elementsToSearchFor4);
  getResponse(urlToCheck5, elementsToSearchFor5);
  getResponse(urlToCheck6, elementsToSearchFor6);

  requestCounter += 1;

  // "Working OK" email notification logic
  // if (requestCounter > checkingNumberBeforeWorkingOKEmail) {
  //   requestCounter = 0;
  //   sendSlackMessage();
  //   // const msg = {
  //   //   to: emailsToAlert,
  //   //   from: emailFrom,
  //   //   subject: '👀👀👀 Website Change Monitor is working OK 👀👀👀',
  //   //   html: `Website Change Monitor is working OK - <b>${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}</b>`,
  //   // };
  //   // sgMail.send(msg)
  //   //   .then(() => { console.log('Working OK Email Sent!'); })
  //   //   .catch((emailError) => { console.log(emailError); });
  // }
}, checkingFrequency);

// Index page render
app.get('/', (req, res) => {
  res.render('index', null);
});

// Server start
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
  slack.alert('✅ Website Change Monitor is working OK ✅', (err) => {
    if (err) {
      console.log('Slack API error:', err);
    } else {
      console.log('Message received in slack!');
    }
  });
});
