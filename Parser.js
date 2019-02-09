module.exports = class Parser {
    constructor($) {
        this.$ = $;
    }

    getTitle() {
        return this._first([
            {
                type: 'meta',
                selector: 'meta[name="twitter:title"]',
            },
            {
                type: 'meta',
                selector: 'meta[property="og:title"]',
            },
            {
                type: 'text',
                selector: 'title',
            },
        ]);
    }

    getUrl() {
        return this._first([
            {
                type: 'meta',
                selector: 'meta[property="og:url"]',
            },
            {
                type: 'link',
                selector: 'link[rel="canonical"]',
            },
        ]);
    }

    getImage() {
        return this._first([
            {
                type: 'meta',
                selector: 'meta[name="twitter:image"]',
            },
            {
                type: 'meta',
                selector: 'meta[property="og:image"]',
            },
            {
                type: 'meta',
                selector: 'meta[itemprop="image"]',
            },
        ]);
    }

    getSiteName() {
        return this._first([
            {
                type: 'meta',
                selector: 'meta[property="og:site_name"]',
            },
        ]);
    }

    getDescription() {
        return this._first([
            {
                type: 'meta',
                selector: 'meta[name="twitter:description"]',
            },
            {
                type: 'meta',
                selector: 'meta[property="og:description"]',
            },
            {
                type: 'meta',
                selector: 'meta[name="description"]',
            },
        ]);
    }

    isLargeCard() {
        return this._find('meta', 'meta[name="twitter:card"]') === 'summary_large_image';
    }

    _first(selectors) {
        for (let i = 0; i < selectors.length; i++) {
            const data = this._find(selectors[i].type, selectors[i].selector);
            if (data) {
                return data;
            }
        }

        return null;
    }

    _find(type, selector) {
        const elem = this.$(selector).first();
        if (!elem.length) {
            return null;
        }

        switch (type) {
            case 'meta':
                return elem.attr('content');

            case 'text':
                return elem.text();

            case 'link':
                return elem.attr('href');
        }

        return null;
    }
};
