#!/bin/sh

echo 'Start Pack Our Project';

prepackPath="./prepack";
distpackPath="../irm-tools-dist";

if [ ! -d "$prepackPath" ]
  then
    mkdir "$prepackPath"
fi

if [ ! -d "$distpackPath" ]
  then
    mkdir "$distpackPath"
fi

# npm run build
cp -rf ./dist "$prepackPath"
cp -f app.config.js "$prepackPath"
cp -rf main "$prepackPath"
cp -f package.json "$prepackPath"
npm run pack
cp -rf "$prepackPath"/* ../irm-tools-dist
rm -rf "$prepackPath"
