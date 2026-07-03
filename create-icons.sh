#!/bin/bash
# 生成 PWA 图标占位符
# 生产环境应使用真实 logo 图片

# 需要 ImageMagick
if ! command -v convert &> /dev/null; then
  echo "需要安装 ImageMagick: sudo yum install ImageMagick"
  exit 1
fi

# 创建 512x512 渐变图标
convert -size 512x512 \
  gradient:'#8b5cf6-#ec4899' \
  -gravity center \
  -pointsize 280 \
  -font DejaVu-Sans-Bold \
  -fill white \
  -annotate +0+0 '🧠' \
  src/icon-512.png

# 缩放到 192x192
convert src/icon-512.png -resize 192x192 src/icon-192.png

echo "图标已生成: src/icon-192.png, src/icon-512.png"
