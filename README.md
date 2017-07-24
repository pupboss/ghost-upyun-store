# Ghost Upyun Storage

This project is forked from 'sanddudu/upyun-ghost-store'.
本项目 fork 自 `sanddudu/upyun-ghost-store`.

This [Ghost custom storage module](https://docs.ghost.org/docs/using-a-custom-storage-module) allows you to store media files at [Upyun](https://www.upyun.com) instead of your local server. It requires Ghost 1.x or higher version!

## Installation

Please read the document provided by Ghost first. [Using a custom storage module](https://docs.ghost.org/docs/using-a-custom-storage-module)

### Via Git

- Create a new folder in `content` named `adapters/storage`

- Clone this repo into `storage`

```
cd [path/to/ghost]/content/adapters/storage
git clone https://github.com/pupboss/ghost-upyun-store.git
```

- Install dependencies

```
cd ghost-upyun-store
npm i
```

## Configuration

In your `config.[env].json` file, you'll need to add a new `storage` block:

```json
{
  // ...
  "storage": {
    "active": "ghost-upyun-store",
    "ghost-upyun-store": {
      "bucket": "bucket-name",
      "operator": "some-operator",
      "password": "password",
      "domain": "https://cdn.xxxxx.com",
      "prefix": "your/folder/",
      "folder": "YYYY/MM/",
      "imageVersion": ""
    }
  },
  // ...
}
```

## License

```
The MIT License (MIT)

Copyright (c) 2017 Jet Lee

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```