# HR Lucky & Group Tool 🎯

HR 活動小工具 — 支援幸運抽獎、自動分組、CSV 名單匯入。

## ✨ 功能

| 功能 | 說明 |
|------|------|
| 📋 名單管理 | 貼上文字 / 上傳 CSV 匯入參加者名單 |
| 🎉 幸運抽獎 | 動畫抽獎效果 + 撒花特效，支援不重複中獎 |
| 🔀 自動分組 | 設定每組人數，一鍵隨機分組，可複製結果 |

## 🛠 技術棧

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 3
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Effects**: Canvas Confetti
- **Deployment**: GitHub Pages (via GitHub Actions)

## 🚀 本地開發

**Prerequisites**: [Node.js](https://nodejs.org/) >= 18

```bash
# 安裝依賴
npm install

# 啟動開發伺服器 (http://localhost:3000)
npm run dev

# 建置 production 版本
npm run build

# 預覽 production 版本
npm run preview
```

## 📁 專案結構

```
hr-helper/
├── index.html              # HTML entry point
├── index.tsx               # React entry point
├── index.css               # Tailwind CSS directives + global styles
├── App.tsx                 # Root component (路由 & Layout)
├── types.ts                # TypeScript 型別定義
├── utils.ts                # 工具函式 (confetti, CSV parser)
├── components/
│   ├── Button.tsx          # 通用按鈕元件
│   ├── DataManager.tsx     # 名單管理頁面
│   ├── LuckyDraw.tsx       # 幸運抽獎頁面
│   └── GroupGenerator.tsx  # 自動分組頁面
├── vite.config.ts          # Vite 設定
├── tailwind.config.js      # Tailwind 設定
├── postcss.config.js       # PostCSS 設定
├── tsconfig.json           # TypeScript 設定
└── .github/workflows/
    └── deploy.yml          # GitHub Pages 自動部署
```

## 🚢 部署 (GitHub Pages)

本專案已設定 GitHub Actions，push 到 `main` 分支即自動部署。

### 首次設定

1. 到 GitHub repo → **Settings** → **Pages**
2. **Source** 選擇 **GitHub Actions**
3. Push 一次 commit 到 `main`，Actions 會自動 build + deploy

部署完成後，存取 `https://<your-username>.github.io/hr-helper/`

> **Note**: 如果 repo 名稱不是 `hr-helper`，需修改 `vite.config.ts` 中的 `base` 路徑。

## 📝 License

MIT
