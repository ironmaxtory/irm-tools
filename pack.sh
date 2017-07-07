#!/bin/sh

echo 'Start Pack Our Project';

prepackPath="./prepack";

if [ ! -d "$prepackPath" ]
  then
    mkdir "$prepackPath"
fi

cp -rf ./dist "$prepackPath"
cp -f app.config.js "$prepackPath"
cp -f main.js "$prepackPath"
cp -f package.json "$prepackPath"
npm run pack
rm -rf "$prepackPath"
