import { gotScraping } from 'got-scraping';
import cheerio from 'cheerio';

const WEBSITE_URL = 'https://vrn.vkusvill.ru';
const storeUrl = `${WEBSITE_URL}/goods/khity`;

const response = await gotScraping(storeUrl);
const html = response.body;

const $ = cheerio.load(html);
const productLinks = $('a.ProductCard__link');

const productUrls = [];
for (const link of productLinks) {
    const relativeUrl = $(link).attr('href');
    const absoluteUrl = new URL(relativeUrl, WEBSITE_URL)
    productUrls.push(absoluteUrl);
}

for (const url of productUrls) {
    // Everything else is exactly the same.
    // We only wrapped the code in try/catch blocks.
    // The try block passes all errors into the catch block.
    // So, instead of crashing the crawler, they can be handled.
    try {
        // The try block attempts to execute our code
        const productResponse = await gotScraping(url);
        const productHtml = productResponse.body;
        const $productPage = cheerio.load(productHtml);
        const productPageTitle = $productPage('h1').text().trim();
        console.log(productPageTitle);
    } catch (error) {
        // In the catch block, we handle errors.
        // This time, we will just print
        // the error message and the url.
        console.error(error.message, url)
    }
}