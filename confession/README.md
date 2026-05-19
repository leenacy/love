# 心潮 · 潮汐告白

参照 [DMU Date](https://dmudate.com/) 交互风格的轻量表白页：海洋浪漫视觉、分步引导、FAQ 手风琴、定时揭晓。

## 本地预览

在项目目录下启动静态服务，例如：

```bash
cd confession
npx --yes serve .
```

浏览器打开提示的地址（通常是 `http://localhost:3000`）。

也可直接用 VS Code / Cursor 的 Live Server 打开 `index.html`。

## 使用方式

1. 打开首页，点击「开始写告白」
2. 填写称呼、署名、想说的话
3. 可选：设置定时揭晓
4. 生成链接后复制发给对方
5. 对方打开 `letter.html#...` 即可看到揭晓动画

## 说明

- 内容编码在 URL 中，**不上传服务器**
- 链接较长，请完整复制
- 部署到任意静态托管（GitHub Pages、Vercel 等）即可
