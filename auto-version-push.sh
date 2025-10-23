#!/bin/bash
set -e

# 版本号格式校验（npm 规范：x.y.z 纯数字）
validate_version() {
  local version=$1
  if [[ ! $version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "错误：版本号格式不正确！必须是 x.y.z 纯数字（如 1.0.5）"
    exit 1
  fi
}

# 拆分数值为数组（x y z）
split_number() {
  IFS='.' read -r -a parts <<< "$1"
  echo "${parts[0]} ${parts[1]} ${parts[2]}"
}

# 比较两个版本大小（返回较大的版本）
compare_versions() {
  local v1=$1
  local v2=$2
  validate_version "$v1"
  validate_version "$v2"
  # 转换为数字比较（如 1.0.5 → 1000005）
  local v1_int=$(echo "$v1" | awk -F '.' '{printf "%03d%03d%03d", $1, $2, $3}')
  local v2_int=$(echo "$v2" | awk -F '.' '{printf "%03d%03d%03d", $1, $2, $3}')
  if [ $v1_int -gt $v2_int ]; then
    echo "$v1"
  else
    echo "$v2"
  fi
}

# 递增版本最后一位（z+1）
bump_last() {
  local x=$1 y=$2 z=$3
  echo "$x.$y.$((z + 1))"
}

# 进入包目录
cd org-tree

# 读取当前版本（纯数字，符合 npm 规范）
current_vue2=$(jq -r '.version' package.vue2.json)
current_vue3=$(jq -r '.version' package.vue3.json)
validate_version "$current_vue2"
validate_version "$current_vue3"

# 取最大值作为基准
max_version=$(compare_versions "$current_vue2" "$current_vue3")
echo "当前最大版本：$max_version"

# 计算新版本（最大值+1 作为vue2版本，vue3版本在此基础上再加1）
read x y z <<< $(split_number "$max_version")
new_vue2_version=$(bump_last "$x" "$y" "$z")
# 计算vue3版本（比vue2版本多增加1）
read x2 y2 z2 <<< $(split_number "$new_vue2_version")
new_vue3_version=$(bump_last "$x2" "$y2" "$z2")

echo "即将发布的vue2新版本：$new_vue2_version"
echo "即将发布的vue3新版本：$new_vue3_version"

# 分别写入两个配置文件
jq --arg v "$new_vue2_version" '.version = $v' package.vue2.json > temp.json && mv temp.json package.vue2.json
jq --arg v "$new_vue3_version" '.version = $v' package.vue3.json > temp.json && mv temp.json package.vue3.json

# --------------------------
# 分别发布两个版本并添加对应标签
# --------------------------
# 1. 发布vue2版本
cp package.vue2.json package.json && cp vite.config.vue2.js vite.config.js
# 替换outDir为dist
sed -i.bak "s/outDir:.*/outDir: path.resolve(__dirname, 'dist'),/" vite.config.js && rm -f vite.config.js.bak
yarn
yarn publish:lib --tag vue2
sleep 1

# 2. 发布vue3版本
cp package.vue3.json package.json && cp vite.config.vue3.js vite.config.js
# 替换outDir为dist
sed -i.bak "s/outDir:.*/outDir: path.resolve(__dirname, 'dist'),/" vite.config.js && rm -f vite.config.js.bak
yarn
yarn publish:lib --tag vue3

npm dist-tag add @liushuai05/org-tree@$new_vue2_version latest


# 返回根目录
cd ..

echo "✅ 发布完成！vue2版本: $new_vue2_version, vue3版本: $new_vue3_version"
