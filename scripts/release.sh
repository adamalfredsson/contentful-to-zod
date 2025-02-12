#!/bin/bash

VERSION=v$(npm version | grep contentful-to-zod | cut -d"'" -f 4)
git push origin $VERSION
gh release create $VERSION --title $VERSION --generate-notes
