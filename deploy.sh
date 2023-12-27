#!/usr/bin/env sh

push_addr=`git remote get-url --push origin`
commit_info=`git describe --all --always --long`
dist_path=docs/.vuepress/dist
push_branch=gh-pages

dir_exists() {
  node -e "var fs = require('fs');var path = require('path'); console.log(fs.existsSync(path.resolve(__dirname,'$1')))"
}

rm_dist(){
  # 回到上次路径
  cd -
  if [ "$(dir_exists $dist_path)" = "true" ]; then
    echo "remove $dist_path"
    # chmod -R 777 $dist_path
    rm -rf $dist_path
  fi
}

handle_error(){
  rm_dist
}

# 确保脚本抛出遇到的错误
set -ex

# 错误的时候执行
trap "handle_error" ERR

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd $dist_path

git init
git add -A
git commit -m "deploy, $commit_info"
git push -f $push_addr HEAD:$push_branch

rm_dist