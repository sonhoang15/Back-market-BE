import puppeteer from "puppeteer";
import db from "../src/models/index.js";
const { Product, ProductVariant } = db;

async function crawlDetailPage(page, product) {
    if (!product.source_url || !product.source_url.startsWith("http")) return null;

    console.log(` Đang crawl chi tiết: ${product.source_url}`);

    await page.goto(product.source_url, { waitUntil: "networkidle2", timeout: 0 });

    // Đợi phần biến thể xuất hiện
    await page.waitForSelector(".select-swap, .swatch", { timeout: 10000 }).catch(() => { });

    const detail = await page.evaluate(() => {
        const desc = document.querySelector(".product-description, .description, .rte")?.innerText.trim() || "";

        const imgs = Array.from(document.querySelectorAll(".product-image img, .swiper-slide img, .owl-item img"))
            .map(img => img.src)
            .filter(src => src && src.startsWith("http"));

        const colors = Array.from(document.querySelectorAll('#variant-swatch-0 .swatch-element label'))
            .map(label => ({
                color:
                    label.getAttribute('data-name') ||
                    label.getAttribute('data-original-title') ||
                    label.querySelector('img')?.alt ||
                    label.innerText?.trim() ||
                    '',
                colorImage: label.getAttribute('data-src') || label.querySelector('img')?.src || null,
            }))
            .filter(c => c.color);

        const sizes = Array.from(document.querySelectorAll('#variant-swatch-1 .swatch-element label'))
            .map(label => {
                const span = label.querySelector('span');
                const sizeText = span ? span.innerText.trim() : (label.getAttribute('data-value') || label.innerText || '').toString().trim();
                const priceAttr = label.getAttribute('data-price') || null;
                const selid = label.getAttribute('data-selid') || label.getAttribute('data-value') || null;
                return {
                    size: sizeText,
                    priceAttr,
                    selid,
                };
            })
            .filter(s => s.size);

        const priceText = document.querySelector('.tp_product_detail_price')?.innerText.trim() || '';
        const priceNumber = priceText ? parseFloat(priceText.replace(/[^\d.-]/g, '')) || null : null;

        const variants = [];
        if (colors.length > 0 && sizes.length > 0) {
            colors.forEach(c => {
                sizes.forEach(s => {
                    variants.push({
                        name: `${c.color}${s.size ? ' - ' + s.size : ''}`.trim(),
                        color: c.color,
                        size: s.size,
                        image: c.colorImage,
                        price: s.priceAttr ? parseFloat(String(s.priceAttr).replace(/[^\d]/g, '')) || priceNumber : priceNumber,
                        selid: s.selid || null,
                    });
                });
            });
        } else if (colors.length > 0) {
            colors.forEach(c => {
                variants.push({
                    name: c.color,
                    color: c.color,
                    size: null,
                    image: c.colorImage,
                    price: priceNumber,
                    selid: null,
                });
            });
        } else if (sizes.length > 0) {
            sizes.forEach(s => {
                variants.push({
                    name: s.size,
                    color: null,
                    size: s.size,
                    image: null,
                    price: s.priceAttr ? parseFloat(String(s.priceAttr).replace(/[^\d]/g, '')) || priceNumber : priceNumber,
                    selid: s.selid || null,
                });
            });
        }

        const status = document.querySelector(".statusProduct")?.innerText.trim() || "";

        return { desc, imgs, variants, price: priceText, status };
    });


    if (!detail.variants || detail.variants.length === 0) {
        console.log(` Không tìm thấy biến thể cho: ${product.name}`);
    } else {
        console.log(` Tìm thấy ${detail.variants.length} nhóm biến thể cho: ${product.name}`);
    }

    return { ...product, ...detail };
}


export async function crawlDetailAll() {
    console.log(" Bắt đầu crawl chi tiết sản phẩm...");

    const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
    const page = await browser.newPage();

    const products = await Product.findAll({
        where: {
            source: "crawl",
        },
    });

    for (const product of products) {
        try {
            if (product.manual_override) {
                console.log(` Bỏ qua (manual_override): ${product.name}`);
                continue;
            }

            const full = await crawlDetailPage(page, product);
            if (!full) continue;

            await product.update({
                description: full.desc,
                images: JSON.stringify(full.imgs || []),
                status: "draft",
            });
            if (full.variants?.length > 0) {
                for (const v of full.variants) {
                    if (!v.color && !v.size) continue;

                    const variantName = v.name || `${v.color || ''}${v.size ? ' - ' + v.size : ''}`.trim();

                    await ProductVariant.findOrCreate({
                        where: {
                            product_id: product.id,
                            color: v.color,
                            size: v.size,
                        },
                        defaults: {
                            product_id: product.id,
                            name: variantName,
                            color: v.color || null,
                            size: v.size || null,
                            image: v.image || null,
                            price: v.price != null ? Number(v.price) : null,
                            stock: v.stock != null ? Number(v.stock) : 1,
                            source_url: product.source_url || null,
                            source_type: "crawler",
                            sync_status: "synced",
                            last_crawled_at: new Date(),
                        },
                    });
                }
            }

            console.log(` Đã cập nhật: ${product.name}`);
        } catch (err) {
            console.error(` Lỗi ở ${product.source_url}: ${err.message}`);
        }
    }

    console.log(" Hoàn thành crawl chi tiết!");
    await browser.close();
}
