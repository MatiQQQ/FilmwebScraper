# FilmwebScraper

## Table of contents

- [General info](#general-info)
- [Requirements](#requirements)
- [Technologies](#technologies)
- [Setup](#setup)
- [Tests](#tests)

## General info

FilmwebScraper is a simple app that will download html from filmweb's ranking from vod section, parse it using cheerio, delete duplicates and take top 10 movies from current year. The movies will be stored in csv file. Default path for writeToCSV function is `./output/movies2023.csv`. Vod services that have been used are:

- Netflix
- Hbo Max
- Disney+
- Canal+

## Requirements

```
NodeJS 14.0+
```

## Technologies

Project is created with:

- Cheerio: 1.0.0-rc.12
- Lodash: 4.17.21
- Axios: 1.4.0
- Pino: 8.14.1
- Pino-Pretty: 10.0.1
- Jest: 29.6.1

## Setup

To run this project, clone this repo and install it locally using npm:

```
$ cd ./FilmwebScraper
$ npm install
$ npm start
```

## Tests

Project uses Jest behind the scenes to run tests. By default '--verbose' flag is set to true in `npm test` command.
Tests will create folder `./test_output` to store `movies2023_test.csv` file.

```
$ cd ./FilmwebScraper
$ npm test
```
