const axios = require("axios");
const cheerio = require("cheerio");
const { existsSync: fsExistsSync } = require("fs");
const { appendFile: fsAppendFile, unlink: fsUnlink } = require("fs/promises");
const _ = require("lodash");
const pino = require("pino");
const { validateServiceName, prettifyServiceName } = require("./utils/helpers");
const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

// title => .rankingType__title
// rate => .rankingType__rate--value

const CURRENT_YEAR = new Date().getFullYear();
const VOD_NAMES = ["netflix", "hbo_max", "canal_plus_manual", "disney"];

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
  extractMovies(serviceName, data) {
    const resultArray = [];
    const parametersAreValid =
      validateServiceName(serviceName) && validateServiceName(data);
    if (!parametersAreValid) throw Error("Parameters are not valid");
    logger.info(`Extracting data from ${serviceName}`);
    const $ = cheerio.load(data);
    $(".rankingType").map((i, el) => {
      if (resultArray.length > 10) return;
      const title = $(el).find(".rankingType__title").text();
      const rating = $(el).find(".rankingType__rate--value").text();
      resultArray.push({
        title,
        rating: Number.parseFloat(rating),
        serviceName,
      });
    });
    return resultArray;
  }
  async export10MoviesFromEachService(serviceName, page = 1, result = []) {
    const isValidServiceName = validateServiceName(serviceName);
    if (!isValidServiceName) throw Error("Invalid service name");
    const prettyServiceName = prettifyServiceName(serviceName);
    try {
      const { data } = await this.getMoviesFromFilmweb(serviceName, page);
      if (page >= 5) return result;
      if (result.length > 10) return result;
      const scrappedData = this.extractMovies(prettyServiceName, data);
      result.push(...scrappedData);
      return this.export10MoviesFromEachService(serviceName, ++page, result);
    } catch (error) {
      throw Error(error);
    }
  }
}
module.exports = { FilmwebScraper, logger };
