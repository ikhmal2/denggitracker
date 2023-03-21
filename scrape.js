const fs = require("fs");
const cheerio = require("cheerio");
const axios = require("axios");
const { log } = require("console");

const idengue = "https://idengue.mysa.gov.my/hotspotutama.php";

const scrapper = async () => {
  try {
    const { data } = await axios.get(idengue);

    const $ = cheerio.load(data);

    const infoEl = $("#myTable > tbody > tr:nth-child(n+2)");

    const scrappedData = [];

    infoEl.each((index, el) => {
      const scrappedItem = {
        NEGERI: "",
        LOKALI: "",
        KES: "",
        TARIKH: "",
        TEMPOH: "",
      };
      scrappedItem.NEGERI = $(el).children("td:nth-child(2)").text();
      scrappedItem.LOKALI = $(el).children("td:nth-child(3)").text();
      scrappedItem.KES = $(el).children("td:nth-child(4)").text();
      scrappedItem.TARIKH = $(el).children("td:nth-child(5)").text();
      scrappedItem.TEMPOH = $(el)
        .children("tr:nth-child(n+2) > td:nth-child(6)")
        .text();
      scrappedData.push(scrappedItem);
    });
    console.dir(scrappedData);
    fs.writeFile(
      "scrapedInfo.json",
      JSON.stringify(scrappedData, null, 2),
      (e) => {
        if (e) {
          console.log(e);
          return;
        }
        console.log("scraping completed");
      }
    );
  } catch (error) {
    console.log(error);
  }
};

scrapper();
