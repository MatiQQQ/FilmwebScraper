const { describe, it, expect } = require("@jest/globals");
const _ = require("lodash");
const { existsSync } = require("fs");
const FilmwebScraper = require("./FilmwebScraper");
const html = require("./utils/data");

const serviceName = "hbo_max";
const filmwebScraper = new FilmwebScraper();

describe("Testing getting data from filmweb website -> getMoviesFromFilmweb()", () => {
  it("should return status 200 after hitting filmweb endpoint", async () => {
    const { statusCode } = await filmwebScraper.getMoviesFromFilmweb(
      serviceName
    );
    expect(statusCode).toBe(200);
  });
});

describe("Testing extracting movies from html -> extractMovies()", () => {
  it("should transform html template to specific array of objects", () => {
    const isArrayEqual = (x, y) => {
      return _(x).xorWith(y, _.isEqual).isEmpty();
    };
    const exampleArrayOfExtractedMovies = [
      { title: "Fenomen", rating: 7.29, serviceName },
      { title: "Nimona", rating: 7.21, serviceName },
    ];
    const extractedMovies = filmwebScraper.extractMovies(serviceName, html);
    const areArraysEqual = isArrayEqual(
      exampleArrayOfExtractedMovies,
      extractedMovies
    );
    expect(areArraysEqual).toBe(true);
  });

  it("should throw an error if one of parameters from extractMovies method is not valid (empty, undefined etc)", () => {
    const functionWrapper = () => {
      filmwebScraper.extractMovies(serviceName);
    };
    expect(functionWrapper).toThrow("Parameters are not valid");
  });
});

describe("Testing writing to csv -> writeToCSV()", () => {
  it("should throw an error if moviesArray parameter is not defined", () => {
    const functionWrapper = async () => {
      await filmwebScraper.writeToCSV();
    };
    expect(functionWrapper).rejects.toThrow();
  });

  it("should throw an error if moviesArray parameter is empty", () => {
    const functionWrapper = async () => {
      await filmwebScraper.writeToCSV([]);
    };
    expect(functionWrapper).rejects.toThrow();
  });

  it("should create a file if proper array is passed", async () => {
    const path = "./test_output/movies2023_test.csv";
    const exampleArrayOfExtractedMovies = [
      { title: "Fenomen", rating: 7.29, serviceName },
      { title: "Nimona", rating: 7.21, serviceName },
    ];
    await filmwebScraper.writeToCSV(exampleArrayOfExtractedMovies, path);
    const fileExists = existsSync(path);
    expect(fileExists).toBe(true);
  });
});
