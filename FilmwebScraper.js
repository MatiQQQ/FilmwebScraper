const axios = require("axios");
const cheerio = require("cheerio");
const { existsSync: fsExistsSync } = require("fs");
const { appendFile: fsAppendFile, unlink: fsUnlink } = require("fs/promises");
const _ = require("lodash");
const pino = require("pino");

const CURRENT_YEAR = new Date().getFullYear();
const VOD_NAMES = ["netflix", "hbo_max", "canal_plus_manual", "disney"];
const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

class FilmwebScraper {
  async getMoviesFromFilmweb(serviceName, page = 1, year = CURRENT_YEAR) {
    const url = `https://www.filmweb.pl/ajax/ranking/vod/${serviceName}/film/${year}/${page}`;
    try {
      const response = await axios.get(url);
      return { statusCode: response.status, data: response.data };
    } catch (error) {
      throw Error(error);
    }
  }
}

module.exports = { FilmwebScraper, logger };
