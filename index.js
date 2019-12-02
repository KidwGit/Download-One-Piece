const puppeteer = require('puppeteer');
const f = require('fs');
const downloader = require('image-downloader');
// Folder to save result
const resultFolder = '../../Comic/OnePiece/chapter_';
// Download from page
const insUrls = 'https://truyenqq.com/truyen-tranh/dao-hai-tac-128-chap-';//940.html';
var START_DOWN_CHAPTER = 964;
var END_DOWN_CHAPTER = 964;


async function getImagesFromPage(url, folderName) {
    if (!f.existsSync(resultFolder + folderName)) {
        f.mkdirSync(resultFolder + folderName);
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const imageSrcSets = await page.evaluate(() => {
        //const imgs = Array.from(document.querySelectorAll('.story-see-content > img'));
        const imgs = Array.from(document.querySelectorAll("img.lazy"));
        const srcSetAttribute = imgs.map(i => i.getAttribute('src'));
        console.log(srcSetAttribute);
        return srcSetAttribute;
    })

    // const imgUrls = imageSrcSets.map(srcSet => getLargestImageFromSrcSet(srcSet));
    // await browser.close();

    // Get Image From Links
    imageSrcSets.forEach((imageSrcSets) => {
        downloader({
            url: imageSrcSets,
            dest: resultFolder + folderName
        })
    });
    console.log('Done!!!')
    //return imgUrls;
}

(async () => {
    var i;
    for (i = START_DOWN_CHAPTER; i <= END_DOWN_CHAPTER; i++) {
        var tempUrl =  insUrls + i + '.html';
        console.log(tempUrl);
        getImagesFromPage(tempUrl,i.toString(10));
    }
})();
