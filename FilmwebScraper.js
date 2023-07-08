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

const CURRENT_YEAR = new Date().getFullYear();
const VOD_NAMES = ["netflix", "hbo_max", "canal_plus_manual", "disney"];

class FilmwebScraper {
  async getMoviesFromFilmweb(serviceName, page = 1, year = CURRENT_YEAR) {
    const prettyServiceName = prettifyServiceName(serviceName);
    const url = `https://www.filmweb.pl/ajax/ranking/vod/${serviceName}/film/${year}/${page}`;
    try {
      const response = await axios.get(url);
      logger.info(`Getting data from ${prettyServiceName}. Page: ${page}`);
      return { statusCode: response.status, data: response.data };
    } catch (error) {
      throw Error(error);
    }
  }
  extractMovies(serviceName, data, page = 1) {
    const resultArray = [];
    const parametersAreValid =
      validateServiceName(serviceName) && validateServiceName(data);
    if (!parametersAreValid) throw Error("Parameters are not valid");
    logger.info(`Extracting data from ${serviceName}. Page: ${page}`);
    const $ = cheerio.load(data);
    $(".rankingType").map((i, el) => {
      if (resultArray.length > 10) return;
      const title = $(el).find(".rankingType__title").text();
      const rating = $(el).find(".rankingType__rate--value").text();
      resultArray.push({
        title,
        rating: +rating.replace(",", "."),
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
      const scrappedData = this.extractMovies(prettyServiceName, data, page);
      result.push(...scrappedData);
      return this.export10MoviesFromEachService(serviceName, ++page, result);
    } catch (error) {
      throw Error(error);
    }
  }

  async writeToCSV(moviesArray, path = "./output/movies2023.csv") {
    logger.info(`Writing data to ${path}`);
    if (!moviesArray || moviesArray.length === 0)
      throw Error("Array of movies has to be defined and not empty");
    if (fsExistsSync(path)) {
      logger.warn("Found old file... Deleting");
      await fsUnlink(path);
    }
    try {
      const heading = `No.,Title,Rating,Service\n`;
      await fsAppendFile(path, heading);
      for (let [index, movie] of moviesArray.entries()) {
        let line = `${index + 1},${movie.title},${movie.rating}, ${
          movie.serviceName
        }\n`;
        await fsAppendFile(path, line);
      }
    } catch (error) {
      throw Error(error);
    }
    logger.info(`Writing to ${path} completed`);
  }

  async init() {
    logger.info("Initializing Filmweb scraper");
    const moviesList = await Promise.all(
      VOD_NAMES.map(
        async (service) => await this.export10MoviesFromEachService(service)
      )
    );
    logger.info("Flatting movies list");
    const flattenMoviesList = _.flattenDeep(moviesList);
    logger.info("Sorting movies list");
    const sortedMovies = _.orderBy(flattenMoviesList, "rating", "desc");
    logger.info("Deleting duplicates in movies list");
    const uniqueMovies = _.uniqBy(sortedMovies, "title");
    logger.info("Taking 10 top movies from the list");
    const top10movies = _.take(uniqueMovies, 10);
    await this.writeToCSV(top10movies);
    logger.info("Filmweb scraper -> done");
  }
}
module.exports = FilmwebScraper;
