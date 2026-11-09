# Disaster Support System — Development Guide

## 1. プロジェクト概要

LoRa × BST-IDを利用した災害支援システムの共同開発プロジェクト。

**GitHub:** https://github.com/s1320123/disaster-support-system

主な機能：
- GPS位置情報の表示
- LoRaノードの監視
- 物資の発注・受注管理
- 支援要請の確認
- Redis・SQLiteによるデータ管理

### 使用技術

- Node.js / Express
- EJS / CSS / JavaScript
- Redis
- SQLite3
- Leaflet
- Git / GitHub

## 2. 開発メンバーと担当

### メンバーA：ダッシュボード担当

ブランチ：`feature/dashboard-ui`

主な編集対象：
- `views/index.ejs`
- `public/css/dashboard.css`（新規作成する場合）

作業内容：
- ダッシュボードのレイアウト
- GPS地図
- LoRaノードの表示
- ステータスカード
- サイドバー・ヘッダー

### メンバーB：物資管理担当

ブランチ：`feature/orders-ui`

主な編集対象：
- `views/orders.ejs`
- `views/order_new.ejs`
- `views/order_detail.ejs`
- `views/requests.ejs`
- `views/request_reply.ejs`
- `public/css/orders.css`（新規作成）

作業内容：
- 発注一覧画面
- 新規発注フォーム
- 物資・支援要請の表示
- 受注管理画面
- 操作ボタン・ステータス表示

※ 担当以外のファイルを変更する場合は、事前に相談する。

## 3. 共通デザインルール

コンセプト：**近未来的な災害対策指令センター**

ダークネイビーを基調に、シアンをアクセントとして使用する。

| 用途 | カラーコード |
|---|---|
| 背景 | `#0B1220` |
| カード | `#172338` |
| 文字 | `#EAF2FF` |
| 補助文字 | `#94A3B8` |
| 境界線 | `#293A55` |
| アクセント | `#22D3EE` |
| 正常・完了 | `#34D399` |
| 注意・処理中 | `#F59E0B` |
| エラー・緊急 | `#F87171` |

### UI設計方針

- 各ページで統一した配色・フォント・余白を使う
- カード型のレイアウトを基本とする
- サイドバーの構成を統一する
- PC・スマートフォンの両方に対応する
- ステータスは色だけでなく文字でも識別できるようにする
- 災害時に必要な情報を優先して表示する
- 実データとサンプルデータを混同しない

## 4. コード編集ルール

1. 既存のLoRa通信処理を壊さない。
2. `app.js` の変更は原則として担当者同士で相談する。
3. `public/css/style.css` は共通CSSとして扱う。
4. 担当画面固有のデザインは、専用CSSファイルに記述する。
5. 既存のEJS変数、フォームの送信先、`name`属性、JavaScriptで参照するIDを不用意に変更しない。
6. 変更後は画面と既存機能を確認する。
7. `main` には原則として直接pushせず、Pull Requestで統合する。

## 5. GitHubの運用

### 作業開始時

```bash
git switch main
git pull origin main
git switch feature/自分の担当ブランチ
git merge main
```

※ 担当ブランチが存在しない場合は `git switch -c feature/ブランチ名` で作成する。未コミットの変更がある場合は整理してから切り替える。

### 作業内容を保存

```bash
git status
git add 編集したファイル
git commit -m "Describe your changes"
git push
```

初回push時に追跡先が設定されていなければ、`git push -u origin ブランチ名` を使う。

### mainへの統合

1. GitHubでPull Requestを作成する。
2. `base: main`、`compare: 自分のブランチ` を選択する。
3. 変更内容を確認する。
4. 動作確認後にマージする。

## 6. 開発環境

開発用設定の例：

| 項目 | 設定例 |
|---|---|
| Webサーバー | 3001 |
| Redis | 6380 |
| SQLite | `dev-data/gateway.db` |

これらは開発用の設定例であり、各メンバーのPCに合わせて構築する。

本番環境のRedis・SQLiteには誤って接続しないこと。

`.env`、`.venv/`、`node_modules/`、`dev-data/`、実際のデータベース、パスワードやトークンはGitHubに登録しない。

## 7. ChatGPTとの開発ルール

各メンバーは、自分のChatGPTにこのガイドを読み込ませてから作業する。

ChatGPTには以下を守ってもらう。

- 既存コードを確認してから変更案を出す
- 初心者にも分かるよう日本語で段階的に説明する
- 変更するファイル名と場所を明示する
- 担当以外のコードを勝手に変更しない
- 共通カラーとUIルールを守る
- 実在しないAPIやデータ項目を推測で作らない
- GitHubへのcommit・push・Pull Requestを順番に案内する

## 8. 最終目標

2人で協力して、見やすく、使いやすく、統一感のある災害支援システムを完成させる。

特に、実際の災害時の情報把握と操作性を重視する。