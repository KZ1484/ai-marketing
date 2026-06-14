# ai-marketing

GitHub Actions + Claude Code で構築する、デジタルマーケティング担当「AI社員」のリポジトリです。

## 概要

SNS(X / Instagram / Facebook / LinkedIn / WhatsApp Business)とWebサイト・ブログを分析し、
AppSheet業務アプリ開発の受注につながる施策(分析 → 戦略立案 → コンテンツ作成 → 配信準備)を
週次で自動実行します。

詳細な方針は [CLAUDE.md](./CLAUDE.md)、各担当の役割は `.claude/agents/` を参照してください。

## 導入ステップ(現在の進捗)

- [x] ステップ1: リポジトリ作成・初期構成
- [ ] ステップ2: 分析・原稿作成の自動化(GitHub Actions週次実行の設定)
- [ ] ステップ3: 配信・投稿まで拡張

## セットアップ(ステップ1完了後の確認事項)

1. GitHubの当該リポジトリ画面で `Settings > Secrets and variables > Actions` を開く
2. `ANTHROPIC_API_KEY` という名前でAnthropic APIキーを登録する
3. `Actions` タブで `marketing-agent` ワークフローを `Run workflow` から手動実行し、
   `data/reports/setup-check.md` が作成されることを確認する

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
