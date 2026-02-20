// @ts-nocheck
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    await page.waitForSelector('#root');

    console.log('\n=== Test 1: 名單管理 ===');
    // Type names into textarea
    const textarea = page.locator('textarea');
    await textarea.fill('王小明\n李大同\n陳小花\n張美玲\n林志明');
    console.log('✅ 已輸入 5 個姓名');

    // Click 加入名單
    await page.getByText('加入名單').click();
    await page.waitForTimeout(500);

    const listItems = page.locator('ul li');
    const count = await listItems.count();
    console.log(count === 5 ? `✅ 名單顯示 ${count} 人` : `❌ 預期 5 人，實際 ${count} 人`);

    await page.screenshot({ path: 'test-screenshots/01-data-manager.png' });
    console.log('📸 截圖: test-screenshots/01-data-manager.png');

    console.log('\n=== Test 2: 幸運抽獎 ===');
    await page.getByText('幸運抽獎').click();
    await page.waitForTimeout(500);

    // Check draw interface
    const drawTitle = await page.getByText('Lucky Winner').isVisible();
    console.log(drawTitle ? '✅ 抽獎介面載入成功' : '❌ 抽獎介面未顯示');

    // Start draw
    await page.getByText('開始抽獎').click();
    console.log('⏳ 抽獎中...');
    await page.waitForTimeout(2000);

    // Stop draw
    await page.getByText('停止 !').click();
    await page.waitForTimeout(1000);

    // Check winner in sidebar
    const historyItems = page.locator('.bg-gradient-to-r.from-amber-50');
    const winnerCount = await historyItems.count();
    console.log(winnerCount > 0 ? `✅ 中獎者已記錄 (${winnerCount} 筆)` : '❌ 中獎紀錄為空');

    await page.screenshot({ path: 'test-screenshots/02-lucky-draw.png' });
    console.log('📸 截圖: test-screenshots/02-lucky-draw.png');

    console.log('\n=== Test 3: 自動分組 ===');
    await page.getByText('自動分組').click();
    await page.waitForTimeout(500);

    // Set group size to 2
    const groupInput = page.locator('input[type="number"]');
    await groupInput.fill('2');

    // Generate groups
    await page.getByText('開始分組').click();
    await page.waitForTimeout(500);

    const groupCards = page.locator('.bg-gradient-to-r.from-indigo-50.to-white');
    const groupCount = await groupCards.count();
    console.log(groupCount === 3 ? `✅ 產生 ${groupCount} 組 (正確)` : `⚠️ 產生 ${groupCount} 組 (預期 3 組)`);

    await page.screenshot({ path: 'test-screenshots/03-group-generator.png' });
    console.log('📸 截圖: test-screenshots/03-group-generator.png');

    console.log('\n=== Test 4: 回到名單管理 ===');
    await page.getByText('名單管理').click();
    await page.waitForTimeout(500);

    const finalCount = await page.locator('ul li').count();
    console.log(finalCount === 5 ? `✅ 名單保留完整 (${finalCount} 人)` : `❌ 名單遺失，剩 ${finalCount} 人`);

    await page.screenshot({ path: 'test-screenshots/04-back-to-data.png' });
    console.log('📸 截圖: test-screenshots/04-back-to-data.png');

    console.log('\n=== 測試完成 ===\n');

    // Keep browser open for 5 seconds so user can see
    await page.waitForTimeout(5000);
    await browser.close();
})();
