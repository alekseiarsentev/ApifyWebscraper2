import { gotScraping } from 'got-scraping';
import * as cheerio from 'cheerio';

const productUrl = 'https://vrn.vkusvill.ru/goods/ananasy-konserv-koltsa-v-ananasovom-soke-18175.html';
const response = await gotScraping(productUrl);
const html = response.body;

const $ = cheerio.load(html);

const title = $('h1').text().trim();
const price = $('span.Price__value').text().trim();
const reviewCount = $('div[class*="Product__rating"] div.Rating__text').text().trim();
const description = $('div[class*="Product__Block"] div.rtext').text().trim();

const product = {
    title,
    price,
    reviewCount,
    description
};

console.log(product);