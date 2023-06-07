// main.js
import { gotScraping } from 'got-scraping';
import cheerio from 'cheerio';
import { parse } from 'json2csv';
import { writeFileSync } from 'fs'; // <---- added a new import

const storeUrl = 'https://vrn.vkusvill.ru/goods/khity/';

const response = await gotScraping(storeUrl);
const html = response.body;

const $ = cheerio.load(html);

const products = $('.ProductCard');

const results = [];
for (const product of products) {
    const titleElement = $(product).find('a.ProductCard__link');
    const title = titleElement.text().trim();

    const priceElement = $(product).find('span.Price__value');
    const price = priceElement.text().trim();

    results.push({ title, price });
}

const csv = parse(results);
writeFileSync('products.csv', csv); // <---- added writing of CSV to file