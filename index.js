const request = require('request-promise');
const cheerio = require('cheerio');
const Parser = require('./Parser');

module.exports.handler = async (event, context, callback) => {
    if (!event.queryStringParameters.url || !/^https?:\/\/([\w-]+\.)*[\w-]+(\/.*)?$/.test(event.queryStringParameters.url)) {
        callback(null, {
            "statusCode": 422,
            "headers": {
                "Content-Type": "application/json; charset=utf-8",
            },
            "body": JSON.stringify({
                status: 422,
                error: 'URL wrong format',
            }),
            "isBase64Encoded": false,
        });
        return;
    }

    const options = {
        uri: event.queryStringParameters.url,
        timeout: 5000,
        transform: (body) => new Parser(cheerio.load(body)),
    };

    const response = await request(options).catch((err) => {
        return {status: err.statusCode || 408, error: err.name};
    });

    if (response.error) {
        callback(null, {
            "statusCode": response.status,
            "headers": {
                "Content-Type": "application/json; charset=utf-8",
            },
            "body": JSON.stringify(response),
            "isBase64Encoded": false,
        });
        return;
    }

    callback(null, {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json; charset=utf-8",
        },
        "body": JSON.stringify({
            status: 200,
            error: null,
            title: response.getTitle(),
            url: response.getUrl() || event.queryStringParameters.url,
            image: response.getImage(),
            siteName: response.getSiteName(),
            description: response.getDescription(),
            isLargeCard: response.isLargeCard(),
        }),
        "isBase64Encoded": false,
    });
};
