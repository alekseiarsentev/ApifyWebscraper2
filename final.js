import { gotScraping } from 'got-scraping';
import * as cheerio from 'cheerio';

const WEBSITE_URL = 'https://vrn.vkusvill.ru';
const storeUrl = `${WEBSITE_URL}/goods/khity`;

console.log('Fetching products on sale.');
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

console.log(`Found ${productUrls.length} products.`);

const results = [];
const errors = [];

for (const url of productUrls) {
    try {
        console.log(`Fetching URL: ${url}`)
        const productResponse = await gotScraping(url);
        const $productPage = cheerio.load(productResponse.body);

        const title = $productPage('h1').text().trim();
        const price = $productPage('span.Price__value').text().trim();
        const reviewCount = $productPage('div[class*="Product__rating"] div.Rating__text').text().trim();
        const description = $productPage('div[class*="Product__Block"] div.rtext').text().trim();
        

        results.push({
            title,
            price,
            reviewCount,
            description,
        });
    } catch (error) {
        errors.push({ url, msg: error.message });
    }
}

console.log('RESULTS:', results);
console.log('ERRORS:', errors);