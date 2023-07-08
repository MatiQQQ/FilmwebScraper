const FilmwebScraper = require("./FilmwebScraper");
const filmwebScraper = new FilmwebScraper();

(async () => {
  try {
    await filmwebScraper.init();
  } catch (error) {
    throw Error(error);
  }
})();
