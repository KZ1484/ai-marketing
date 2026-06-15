# ai-marketing

GitHub Actions + Claude Code で構築する、デジタルマーケティング担当「AI社員」のリポジトリです。

## 概要

SNS(X / Instagram / Facebook / LinkedIn / WhatsApp Business)とWebサイト・ブログを分析し、
AppSheet業務アプリ開発の受注につながる施策(分析 → 戦略立案 → コンテンツ作成 → 配信準備)を
週次で自動実行します。

詳細な方針は [CLAUDE.md](./CLAUDE.md)、各担当の役割は `.claude/agents/` を参照してください。

## 導入ステップ(現在の進捗)

- [x] ステップ1: リポジトリ作成・初期構成
- [ ] ステップ2: 分析・原稿作成の自動化(GA4連携 + GitHub Actions週次実行)
- [ ] ステップ3: 配信・投稿まで拡張

## セットアップ

### ステップ1(完了済み)

1. `Settings > Secrets and variables > Actions` に `ANTHROPIC_API_KEY` を登録済み
2. Claude Code GitHub App をインストール済み
3. ワークフロー手動実行で `data/reports/setup-check.md` が作成されることを確認済み

### ステップ2: GA4連携

1. Google Cloudでサービスアカウントを作成し、JSON形式のキーをダウンロードする
2. GA4の管理画面(`プロパティ設定 > プロパティのアクセス管理`)で、
   上記サービスアカウントのメールアドレスを「閲覧者(Viewer)」として追加する
3. ダウンロードしたJSONキーをBase64エンコードする(PowerShellの例)

   ```powershell
   $bytes = Get-Content -Path .\service-account-key.json -Raw -Encoding utf8
   $b64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($bytes))
   $b64 | Set-Clipboard
   ```

   (クリップボードにコピーされるので、そのまま次のSecret登録に貼り付けられます)

4. `Settings > Secrets and variables > Actions` に以下の2つのSecretを登録する
   - `GA4_PROPERTY_ID`: GA4のプロパティID(数字のみ。GA4管理画面の「プロパティの詳細」で確認できる)
   - `GA4_SERVICE_ACCOUNT_KEY_B64`: 上記でBase64エンコードした文字列
5. `Actions` タブから `marketing-agent` を手動実行し、以下が作成されることを確認する
   - `data/analytics/YYYY-MM-DD-ga4.json`
   - `data/reports/YYYY-MM-DD-analytics-summary.md`
   - `data/reports/YYYY-MM-DD-strategy.md`
   - `content/blog/YYYY-MM-DD-<タイトル概要>.md`

## ディレクトリ構成

```
ai-marketing/
├── .github/workflows/
│   └── marketing-agent.yml
├── .claude/
│   ├── agents/
│   │   ├── analytics-agent.md
│   │   ├── content-writer-agent.md
│   │   ├── strategy-agent.md
│   │   └── scheduler-agent.md
│   └── commands/
├── CLAUDE.md
├── data/
│   ├── analytics/
│   └── reports/
└── content/
    ├── blog/
    ├── x/
    ├── instagram/
    ├── facebook/
    ├── linkedin/
    └── whatsapp/
```
