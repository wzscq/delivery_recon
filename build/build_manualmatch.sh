#!/bin/sh
echo create folder for build package ...
if [ ! -e package ]; then
  mkdir package
fi

if [ ! -e package/web ]; then
  mkdir package/web
fi

echo build the code ...
cd ../manualmatch
npm install
sed -i  's/host=\"*.*\"/host=\"\"/' ./public/index.html
npm run build
cd ../build

echo remove last package if exist
if [ -e package/web/manualmatch ]; then
  rm -rf package/web/manualmatch
fi

mv ../manualmatch/build ./package/web/manualmatch

echo manualmatch package build over.
