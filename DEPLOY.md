# EatSoEasy 部署发布流程文档

## 项目信息

| 项目 | 值 |
|---|---|
| 项目名 | EatSoEasy (今天吃什么) |
| 技术栈 | React 18.3.1 + TypeScript 5.6.3 + Vite 5.4.11 |
| GitHub 仓库 | `https://github.com/XiangHongJiang/easyEat.git` |
| 线上地址 | `https://xianghongjiang.github.io/easyEat/` |
| 部署分支 | `dist` |
| Node 版本要求 | >= 20.0.0 |

---

## 一、环境准备

### 1.1 Node 版本

```bash
nvm use 20
```

> ⚠️ 必须使用 Node 20+，Node 16 会导致 `crypto.getRandomValues` 报错，Vite 5 也要求 Node 18+。

### 1.2 关键配置文件

**`vite.config.ts`** — 设置 `base` 路径：
```ts
base: '/easyEat/',  // GitHub Pages 子路径，必须与仓库名一致
```

**`tsconfig.json`** — 不要使用 `baseUrl`，paths 用相对路径：
```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```
> ⚠️ TS 5.6 在 CI 模式下不支持 `baseUrl`，paths 必须用 `./src/*` 而非 `src/*`，否则报 TS5102/TS5090。

**`.gitignore`** — `dist/` 在主分支被忽略，部署时需手动处理。

**`package.json`** — 关键脚本和依赖：
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "deploy": "npm run build && gh-pages -d dist -b dist -m 'deploy: 发布更新'"
  },
  "devDependencies": {
    "gh-pages": "^6.3.0"
  },
  "engines": { "node": ">=20.0.0" }
}
```

> `gh-pages -b dist` 表示推送到 `dist` 分支（默认是 `gh-pages`），`-m` 设置提交信息。

---

## 二、发布流程

> GitHub Pages 已配置完毕，指向 `dist` 分支，后续无需再改设置。

### 一键发布

```bash
nvm use 20
npm run deploy
```

`npm run deploy` 会自动完成：
1. `tsc -b` — TypeScript 编译检查
2. `vite build` — 打包到 `dist/` 目录
3. `gh-pages -d dist -b dist` — 将 `dist/` 内容推送到远程 `dist` 分支

### 验证

- 等待 1-2 分钟
- 访问 `https://xianghongjiang.github.io/easyEat/`
- 页面应正常显示"今天吃什么"应用

---

## 三、更新发布（后续迭代）

代码更新后重新发布的流程：

```bash
# 1. 在 main 分支修改代码、提交
git add -A && git commit -m "feat: 新功能"

# 2. 一键构建并部署
nvm use 20 && npm run deploy
```

> 如果网络不稳定导致推送超时，多试几次，或开代理后重试。

---

## 四、常见问题

| 问题 | 原因 | 解决方案 |
|---|---|---|
| 访问 404 | `dist` 分支不存在或内容为空 | 确认分支已推送且包含 `index.html` |
| 访问白屏 | `base` 路径不对 | `vite.config.ts` 中 `base` 必须为 `/easyEat/` |
| `crypto.getRandomValues` 报错 | Node 版本过低 | `nvm use 20` |
| TS5102/TS5090 | tsconfig 有 `baseUrl` 或 paths 格式错 | 删除 `baseUrl`，paths 用 `./src/*` |
| 推送超时 | 国内网络访问 github.com 不稳定 | 多试几次，或开代理后重推 |
| 推送后仍 404 | 分支刚推送，GitHub 还在构建 | 等 1-2 分钟后刷新 |

---

## 五、关键文件清单

| 文件 | 作用 |
|---|---|
| `vite.config.ts` | `base: '/easyEat/'` 配置 Pages 子路径 |
| `tsconfig.json` | TS 编译配置，paths 用相对路径 |
| `package.json` | `deploy` 脚本（推送到 `dist` 分支）、Node 版本约束 |
| `.gitignore` | 忽略 `dist/`、`node_modules/` 等 |
| `public/favicon.svg` | 站点图标 |
