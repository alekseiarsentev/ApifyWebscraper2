import { PlaywrightCrawler, Dataset } from 'crawlee';

async function executeCrawler(url) {
    const crawler = new PlaywrightCrawler({
        headless: true,
        requestHandler: async ({ parseWithCheerio, request, enqueueLinks }) => {
            console.log(`Fetching URL: ${request.url}`);

            if (request.label === 'start-url') {
                await enqueueLinks({
                    selector: 'a.ProductCard__link',
                });
                return;
            }

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

    await crawler.addRequests([
        {
            url,
            label: 'start-url',
        },
    ]);

    await crawler.run();
    await Dataset.exportToJSON('results');
}

const startUrl = 'https://vrn.vkusvill.ru/goods/gotovaya-eda/';

for (let i = 1; i <= 41; i++) {
    const pageUrl = i === 1 ? startUrl : `${startUrl}?PAGEN_1=${i}`;
    await executeCrawler(pageUrl);
}