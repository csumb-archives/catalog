#!/bin/bash
cd /tmp
git config --global user.name "CSUMB web deploy"
git config --global user.email "webfolk@csumb.edu"

git clone -b gh-pages https://$GITHUB_USER:$GITHUB_TOKEN@github.com/csumb-archives/catalog-archive-test.git _dist
git clone -b build https://$GITHUB_USER:$GITHUB_TOKEN@github.com/csumb-archives/catalog-archive-test.git build

cd build/courses
npm install
node --max-old-space-size=8192 generate.js ../../_dist/courses/json/
cd _dist
git add courses/*
git commit -m "Autodeploy: updated design submodule to csumbdotedu/_design@$TRAVIS_COMMIT"
git push origin gh-pages
