// This file executes as a child within the background. It's purpose is to continuely update the data for the ransomwatch bot to use.

// log that the script is running
console.log("Polling script started.");

// import 
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/rwnew.json');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { Webhook, MessageBuilder } = require('discord-webhook-node');

const hook = new Webhook('REDACTED');
const logo = "https://i.imgur.com/5Dn2liF.png";
hook.setUsername('👁');
hook.setAvatar(logo);
const baseurl = "https://eye.intelfeed.sh/";


const interval = 5 * 60 * 1000; // 5 minutes in milliseconds

// function that strips "<, >, /, \, *, ?, |, :, " from a strin
function stripSpecialChars(str) {
  return str.replace(/[<>/\\*?|":\n]/g, '');
}

async function pollNewVictims() {
  const oldData = fs.readFileSync(filePath, 'utf8');

  //console.log("Polling API for new victims...");

  const response = await fetch('https://eye.intelfeed.sh/api/recent/10');
  const data = await response.json();
  const fields = data.map((field) => {
    return {
      post_title: stripSpecialChars(field.post_title), // Sanitize the post_title
      discovered: field.discovered,
      company_description: stripSpecialChars(field.description), // Sanitize the company_description
      group_name: field.group_name,
      screenshot: field.screen,
      link: field.link,
    };
  });

  // Compare the new fields against the old fields
  const newFields = fields.filter((field) => {
    return !oldData.includes(field.post_title);
  });

  if (newFields.length > 0) {
    console.log("New victims found. Writing to file...");
    fs.writeFileSync(filePath, JSON.stringify(fields, null, 2));
  } else {
    return;
  }

  POSTNewVictims(newFields);
}

setInterval(pollNewVictims, interval);


// Craft webhook payload using return from pollNewVictims function
function POSTNewVictims(newFields) {

  

  if (newFields.length === 0) {
    return;
  }


    newFields.forEach(element => {
      if (element && typeof element === 'object') {
        const embedMsg = new MessageBuilder()
          .setTitle(element.post_title)
          .addField("Threat Actor: ", element.group_name)
          .setDescription(element.company_description + "\n\n")
          .setThumbnail(logo)
          .setFooter("Discovered at: " + element.discovered)
          .setColor('#ff0000');

        if (element.screenshot != null) {
          embedMsg.setImage(baseurl + encodeURIComponent(element.screenshot));
        }
        console.log("Sending Webhook for: " + element.post_title);

        // stops us getting banned by discord api 
        setTimeout(() => {
          hook.send(embedMsg);
        }, 20000); // 20 seconds delay
      }
    });

  console.log("Sending Webhook...");
}
