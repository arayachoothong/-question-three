
const puppeteer = require('puppeteer');
(async () => {
    const fundName = process.argv[2]
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://codequiz.azurewebsites.net/', { waitUntil: 'networkidle0' });

    const elements = await page.$x('/html/body/input')
    await elements[0].click()

    await Promise.all([
        page.waitForNavigation(),
    ]);

    const data = await page.evaluate(() => {
        const trs = Array.from(document.querySelectorAll('body > table > tbody > tr'))
        return trs.map(tr => tr.innerText)
    });

    let dataList, result;

    dataList = data.map(el => el.split("\t"))
    result = dataList.find((el, index) => {
        if (index > 0 && el[0] == fundName) {
            return el[1]
        }
    })

    if (result) {
        console.log(result[1])
    } else {
        console.log("not found")
    }

    browser.close()


})();

