# LanguageTransfer2

Proof of concept (prototype) of Language Transfer web app.

This is a Dot Net Core app with a React frontend.

## Developing

- Run `dotnet watch run`
- Connect to https://localhost:5001

## Getting started

Run by typing `dotnet run`.

## Audio files

### Automated setup

There's a file called `convert.js` which converts the audio files pulled from SoundCloud into `.webm` files, then rewrites them into `base64`.

Make sure to `npm install` before running the script.

`ffmpeg` is needed for the script to work.

### Manual setup

The `mp3` audio files were downloaded from SoundCloud.

I then converted to `webm` as [recommended by hower.js](https://github.com/goldfire/howler.js#format-recommendations):

```
ffmpeg -i 01.mp3 -dash 1 01.webm
```

Change the file to base64 (make sure it starts with `data:audio/webm` not `data:video/webm`).

## MIT Licensed

Copyright 2018 Harvey Williams

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
