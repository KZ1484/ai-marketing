// scripts/fetch-ga4.js
//
// GA4 (Google Analytics Data API) から直近7日間のデータを取得し、
// data/analytics/YYYY-MM-DD-ga4.json に保存する。
//
// 必要な環境変数:
//   GA4_PROPERTY_ID            : GA4プロパティID(数字のみ。 "properties/123456789" の "123456789" の部分)
//   GOOGLE_APPLICATION_CREDENTIALS : サービスアカウントキー(JSON)ファイルのパス
//
// 出力フォーマット:
// {
//   "fetched_at": "2026-06-15T00:00:00.000Z",
//   "date_range": { "start": "7daysAgo", "end": "today" },
//   "site_totals": { "sessions": 0, "activeUsers": 0, "screenPageViews": 0 },
//   "top_pages": [
//     { "pagePath": "/blog/xxx", "sessions": 0, "screenPageViews": 0, "activeUsers": 0 }
//   ]
// }

const fs = require("fs");
const path = require("path");
const { BetaAnalyticsDataClient } = require("@google-analytics/data");

async function main() {
  const propertyId = process.env.GA4_PROPERTY_ID;
  if (!propertyId) {
    throw new Error("環境変数 GA4_PROPERTY_ID が設定されていません");
  }

  const client = new BetaAnalyticsDataClient();

  // サイト全体の合計値
  const [totalsResponse] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
    metrics: [
      { name: "sessions" },
      { name: "activeUsers" },
      { name: "screenPageViews" },
    ],
  });

  const totalsRow = totalsResponse.rows && totalsResponse.rows[0];
  const siteTotals = {
    sessions: Number(totalsRow?.metricValues?.[0]?.value ?? 0),
    activeUsers: Number(totalsRow?.metricValues?.[1]?.value ?? 0),
    screenPageViews: Number(totalsRow?.metricValues?.[2]?.value ?? 0),
  };

  // ページ別の内訳(アクセスが多い順、上位20件)
  const [pagesResponse] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
    dimensions: [{ name: "pagePath" }],
    metrics: [
      { name: "sessions" },
      { name: "screenPageViews" },
      { name: "activeUsers" },
    ],
    orderBys: [
      { metric: { metricName: "screenPageViews" }, desc: true },
    ],
    limit: 20,
  });

  const topPages = (pagesResponse.rows || []).map((row) => ({
    pagePath: row.dimensionValues?.[0]?.value ?? "",
    sessions: Number(row.metricValues?.[0]?.value ?? 0),
    screenPageViews: Number(row.metricValues?.[1]?.value ?? 0),
    activeUsers: Number(row.metricValues?.[2]?.value ?? 0),
  }));

  const output = {
    fetched_at: new Date().toISOString(),
    date_range: { start: "7daysAgo", end: "today" },
    site_totals: siteTotals,
    top_pages: topPages,
  };

  const today = new Date().toISOString().slice(0, 10);
  const outDir = path.join(__dirname, "..", "data", "analytics");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${today}-ga4.json`);
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");

  console.log(`GA4データを ${outPath} に保存しました`);
  console.log(JSON.stringify(output, null, 2));
}

main().catch((err) => {
  console.error("GA4データの取得に失敗しました:", err);
  process.exit(1);
});
