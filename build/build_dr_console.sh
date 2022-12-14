#!/bin/sh
echo create folder for build package ...
if [ ! -e package ]; then
  mkdir package
fi

if [ ! -e package/web ]; then
  mkdir package/web
fi

echo build the code ...
cd ../dr_console
npm install
sed -i  's/host=\"*.*\"/host=\"\"/' ./public/index.html
npm run build
cd ../build

echo remove last package if exist
if [ -e package/web/dr_console ]; then
  rm -rf package/web/dr_console
fi

mv ../dr_console/build ./package/web/dr_console

echo dr_console package build over.
