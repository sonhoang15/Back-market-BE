import puppeteer from "puppeteer";
import db from "../src/models/index.js";
const { Product, Category, ProductVariant } = db;

const CATEGORY_URLS = [
    {
        url: [
            "https://krik.vn/ao-phong-pc6379.html",
            "https://krik.vn/ao-blazer-pc564635.html",
            "https://krik.vn/so-mi-dai-tay-pc565516.html"
        ], name: "Áo"
    },
    {
        url: [
            "https://krik.vn/quan-jeans-pc6415.html",
            "https://krik.vn/quan-short-pc6416.html"
        ], name: "Quần"
    },
    {
        url: [
            "https://krik.vn/day-lung-pc501329.html",
            "https://krik.vn/giay-dep-pc501331.html"
        ], name: " Phụ kiện"
    },
];


async function crawlCategory(page, url) {
    console.log(` Đang crawl danh mục: ${url}`);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 });
    await page.waitForSelector(".product-resize.pro-loop", { timeout: 5000 }).catch(() => null);

    const products = await page.$$eval(".product-resize.pro-loop", (items) =>
        items.map((el) => ({
            name: el.querySelector(".tp_product_name")?.innerText.trim() || "",
            price: el.querySelector(".tp_product_price")?.innerText.trim() || "",
            thumbnail: el.querySelector("img.img-loop")?.src || "",
            link: el.querySelector("a.p-img-box")?.href || "",
        }))
    );

    console.log(` Crawl được ${products.length} sản phẩm`);
    return products;
}


async function crawlProductDetail(page, url) {
    try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 });
        await new Promise((r) => setTimeout(r, 1000));

        const data = await page.evaluate(() => {
            const desc =
                document.querySelector(".product-description, .description, .rte")?.innerText.trim() || "";

            const imgs = Array.from(document.querySelectorAll(".swiper-slide img, .owl-item img"))
                .map((img) => img.src)
                .filter((src) => src.startsWith("http"));

            return { desc, imgs };
        });

        return data;
    } catch (e) {
        console.error(` Lỗi crawl chi tiết ${url}:`, e.message);
        return { desc: "", imgs: [], variants: [] };
    }
}


export async function crawlList() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    let totalProducts = 0;

    for (const { url: categoryUrls, name: categoryName } of CATEGORY_URLS) {

        for (const categoryUrl of categoryUrls) {

            const products = await crawlCategory(page, categoryUrl);
            totalProducts += products.length;

            const [category] = await Category.findOrCreate({
                where: { name: categoryName },
                defaults: { description: "" },
            });

            for (const p of products) {
                if (!p.name?.trim() || !p.link?.startsWith("http")) continue;

                const detail = await crawlProductDetail(page, p.link);
                const priceNum = parseFloat(p.price.replace(/[^\d]/g, "")) || null;

                const [product, created] = await Product.findOrCreate({
                    where: { source_url: p.link },
                    defaults: {
                        name: p.name,
                        thumbnail: p.thumbnail,
                        category_id: category.id,
                        description: detail.desc,
                        source: "crawl",
                        source_url: p.link,
                        price_min: priceNum,
                        price_max: priceNum,
                        sync_status: "synced",
                        last_crawled_at: new Date(),
                    },
                });

                if (!created) {
                    await product.update({
                        name: p.name,
                        thumbnail: p.thumbnail,
                        description: detail.desc,
                        price_min: priceNum,
                        price_max: priceNum,
                        last_crawled_at: new Date(),
                    });
                }

                if (detail.variants?.length > 0) {
                    for (const v of detail.variants) {
                        await ProductVariant.findOrCreate({
                            where: { name: v.name, product_id: product.id },
                            defaults: {
                                product_id: product.id,
                                name: v.name,
                                source_type: "crawler",
                                sync_status: "synced",
                                last_crawled_at: new Date(),
                            },
                        });
                    }
                }
            }

            console.log(` Đã lưu ${products.length} sản phẩm cho danh mục "${categoryName}"`);
        }
    }
}