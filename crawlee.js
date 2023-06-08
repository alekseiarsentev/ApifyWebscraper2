// To save data to disk, we need to import Dataset.
import { CheerioCrawler, Dataset } from 'crawlee';

const crawler = new CheerioCrawler({
    requestHandler: async ({ $, request, enqueueLinks }) => {
        console.log(`Fetching URL: ${request.url}`)

        if (request.label === 'start-url') {
            await enqueueLinks({
                selector: 'a.ProductCard__link',
            });
            // When on the start URL, we don't want to
            // extract any data after we extract the links.
            return;
        }

        // We copied and pasted the extraction code
        // from the previous lesson with small
        // refactoring: e.g. `$productPage` to `$`.
        const title = $('h1').text().trim();
        const link = $('div[class*="Product__cols"] link').attr('href');
        const imagelink = $('div[class*="ProductGallery__image"] a').attr('href');
        const price = $('span.Price__value').text().trim();
        const reviewCount = $('div[class*="Product__rating"] div.Rating__text').text().trim();
        const description = $('div[class*="Product__Block"] div.rtext').text().trim();

        // Instead of printing the results to
        // console, we save everything to a file.
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
    url: 'https://vrn.vkusvill.ru/goods/khity/',
    label: 'start-url',
}]);

await crawler.run();