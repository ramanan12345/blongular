Blongular v0.0.1 (alpha)
==========================

![](https://dl.dropboxusercontent.com/u/21773527/blongular.png)

# Quick Start

## Requirements

- Node.JS v0.8.x with NPM
- MongoDB server running anywhere

## Install

- Download the lastest version of Blongular. ([Download ZIP](https://github.com/blongular/blongular-release/archive/master.zip) | [Download TAR](https://github.com/blongular/blongular-release/archive/master.tar.gz))
- Decompress it.
- Inside the new directory, type: `npm install`

## Setup (--setup)

Now let's setup your new blongular.

- Inside blongular's directory, type: `node blongular --setup`
- Visit `http://<your ip address or localhost>:27890/` on your browser.]
- Fullfil the setup form.

## Updating

- Download the latest version of Blongular.
- Decompress it.

### Blongular Update

- Move the directory `blongular` from the new decompressed directory to your working blongular directory.

### Theme Update

- Move the directory `blogs/blog/themes/default` from the new decompressed directory
to the directory `blongs/blog/themes/` inside your working blongular directory.

# Structure

## Built with

- [WNS Middleware](http://github.com/yeptlabs/wns)
- [Angular](http://github.com/angular/angular.js)
- [Bootstrap](http://github.com/twbs/bootstrap)
- [Express](http://github.com/visionmedia/express)
- [Mongoose (MongoDB)](http://github.com/LearnBoost/mongoose)
- [DustJS](http://github.com/linkedin/dustjs)
- [jQuery](http://github.com/jquery/jquery)
- [Medium-Editor](http://github.com/daviferreira/medium-editor)

## Features
- WYSIWYG Editor ([Medium Editor](https://github.com/daviferreira/medium-editor))
- Theme Support (DustJS as template engine)
- Plugin Support (with CoffeeScript support)
- Multiple Account Support
- Multiple Blog Support
- Multiple Domain Support
- Gravatar Support
- Setup Manager

## Coming Soon™ (feel free to help)

- Performance Improvements
- Support Other Template Engines (like Jade)
- Easy Install Plugin Manager
- Internationalization (I18N)
- Search
- Static Content Rendering Mode
- Search Engine Optimization

[Make sugestions!](https://github.com/blongular/blongular/issues)

## Blongular's directory

```
/blogs/                 Directory where you put all your blongular blogs
config.json             Blongular server configuration
```

The rest you should ignore, unless you want to edit blongular's behavior.

## Blongular's Blog directory
```
/plugins/               Directory where you install your plugins
/themes/                Directory where you install your themes
blongular.json          Blog's configuration
components.json         Blog's components configurations
plugins.json            Blog's plugins configurations
```

# Support & Contribute

You can support this project:
- Leaving a [star](https://github.com/blongular/blongular/star)
- Leaving [suggestions](https://github.com/blongular/blongular/issues)
- Requesting [features](https://github.com/blongular/blongular/issues)
- Reporting [issues](https://github.com/blongular/blongular/issues)
- Building [plugins](https://github.com/blongular/blongular-seed/blob/master/plugins/README.md)
- Building [themes](https://github.com/blongular/blongular-theme-default)
- Helping with [money](https://www.gittip.com/pedronasser/) or [bitcoin](https://coinbase.com/checkouts/08cba7f31ee661419e122a5f0350b489)
- Obvious: [Commiting](https://github.com/blongular/blongular/pulls)

Feel welcome to send **Issues and Pull Requests**, but [read this before](https://github.com/blongular/blongular/blob/master/CONTRIBUTING.md), please.

# MIT License

Copyright (c) 2013 Pedro Nasser <http://pedroncs.com/>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/blongular/blongular/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

