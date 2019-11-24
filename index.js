const puppeteer = require('puppeteer');
const f = require('fs');
const downloader = require('image-downloader');
const resultFolder = '../../Comic/OnePiece/chapter_';//_940';
const insUrls = 'https://truyenqq.com/truyen-tranh/dao-hai-tac-128-chap-';//940.html';
var START_DOWN_CHAPTER = 939;
var END_DOWN_CHAPTER = 939;

function getLargestImageFromSrcSet(srcSet) {
    const splitedSrcs = srcSet.split(',');

    const imgSrc = splitedSrcs[splitedSrcs.length - 1].split(' ')[0];
    return imgSrc;
}

async function getImagesFromPage(url, folderName) {
    if (!f.existsSync(resultFolder + folderName)) {
        f.mkdirSync(resultFolder + folderName);
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    //console.log('Page loaded');

    const imageSrcSets = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('.story-see-content > img'));
        const srcSetAttribute = imgs.map(i => i.getAttribute('src'));
        console.log(srcSetAttribute);
        return srcSetAttribute;
    })

    const imgUrls = imageSrcSets.map(srcSet => getLargestImageFromSrcSet(srcSet));
    await browser.close();


    //console.log(imgUrls);
    // Get Image From Links
    imgUrls.forEach((imgUrl) => {
        downloader({
            url: imgUrl,
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
    //getImagesFromPage(insUrls);
    //const images = getImagesFromPage(insUrls);
    //console.log(images);
    // images.forEach((image) => {
    //     downloader({
    //         url: image,
    //         dest: resultFolder
    //     })
    // });
})();