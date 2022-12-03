#!/bin/sh
echo create folder for build package ...
if [ ! -e package ]; then
  mkdir package
fi

if [ ! -e package/web ]; then
  mkdir package/web
fi

echo build the code ...
cd ../matchresult
npm install
sed -i  's/host=\"*.*\"/host=\"\"/' ./public/index.html
npm run build
cd ../build

echo remove last package if exist
if [ -e package/web/matchresult ]; then
  rm -rf package/web/matchresult
fi

mv ../matchresult/build ./package/web/matchresult

echo matchgroup package build over.
