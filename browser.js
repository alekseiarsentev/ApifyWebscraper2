// First, import PlaywrightCrawler instead of CheerioCrawler
import { PlaywrightCrawler, Dataset } from 'crawlee';

const crawler = new PlaywrightCrawler({
    // Second, tell the browser to run with visible UI,
    // so that we can see what's going on.
    headless: true,
    // Third, replace $ with parseWithCheerio function.
    requestHandler: async ({ parseWithCheerio, request, enqueueLinks }) => {
        console.log(`Fetching URL: ${request.url}`)

        if (request.label === 'start-url') {
            await enqueueLinks({
                selector: 'a.ProductCard__link',
            });
            return;
        }

        // Fourth, parse the browser's page with Cheerio.
        const $ = await parseWithCheerio();

        const title = $('h1').text().trim();
        const link = $('div[class*="Product__cols"] link').attr('href');
        const imagelink = $('div[class*="ProductGallery__image"] a').attr('href');
        const price = $('span.Price__value').text().trim();
        const reviewCount = $('div[class*="Product__rating"] div.Rating__text').text().trim();
        const description = $('div[class*="Product__Block"] div.rtext').text().trim();
        

        await Dataset.pushData({
            title,
            link,
            imagelink,
            price,
            reviewCount,
            description,
        });
    },
});

await crawler.addRequests([{
    url: 'https://vrn.vkusvill.ru/goods/gotovaya-eda/malo-kaloriy/',
    label: 'start-url',
}]);

// ...
await crawler.run();
// Add this line to export to JSON.
await Dataset.exportToJSON('results');
