const url = require("url");
const request = require('request-promise');
const cheerio = require('cheerio');
const Parser = require('./Parser');

module.exports.handler = async (req) => {
    if (!req.queryStringParameters.url || !/^https?:\/\/([\w-]+\.)*[\w-]+(\/.*)?$/.test(req.queryStringParameters.url)) {
        return {
            status: 422,
            error: 'URL wrong format',
        };
    }

    const options = {
        uri: req.queryStringParameters.url,
        timeout: 5000,
        transform: (body) => new Parser(cheerio.load(body)),
    };

    const response = await request(options).catch((err) => {
        return {status: err.statusCode || 408, error: err.name};
    });

    if (response.error) {
        return response;
    }

    return {
        status: 200,
        title: response.getTitle(),
        url: response.getUrl() || url,
        image: response.getImage(),
        siteName: response.getSiteName(),
        description: response.getDescription(),
        isLargeCard: response.isLargeCard(),
    };
};
