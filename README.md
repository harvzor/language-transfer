# Language Transfer Web App

Proof of concept (prototype) of Language Transfer web app.

This is a .NET Core app with a React front end.

<p align="center">
    <img alt="Language Transfer Web App on iPhone" src="/project/language-transfer-v1.png"/>
</p>

## About

### What is Language Transfer?

Language Transfer is a free audio course provided by Mihalis Eleftheriou.

The audio course avoids learning grammar, and instead builds on knowledge which is available to the listener. The listener learns how to ask something in a target language by building on what they already know.

I think this approach is very easy to get into and I highly recommend the audiou course.

You can read more about the audio course available at https://www.languagetransfer.org/whats-language-transfer.

### What is this project?

I found that listening to the audio courses was quite difficult using pre-existing software (such as tradional audio players, or SoundCloud/YouTube where the tracks are already hosted).

This web app aims to solve these issues:

- unless the user downloads the tracks, the tracks cannot be listened to offline
- remembering which track can be hard without personally noting down which tracks I've listened to
- difficult to skip forwards and backwards by a few seconds in the track
- the phone screen turns off while the course is playing (hindering the ability to pause the track to think)

## Developing

- Run `dotnet watch run`
- Connect to https://localhost:5001

## Audio files

Audio files are needed for this project to work. For space saving reasons (not wanting the repo to get too large) they need to be added to the project.

### Automated setup

There's a file called `convert.js` which converts the audio files pulled from SoundCloud into `.webm` files, then rewrites them into `base64` (this step appears to be unnecessary).

Make sure to `npm install` before running the script.

`ffmpeg` is needed for the script to work.

### Manual setup

The `mp3` audio files were downloaded from SoundCloud.

I then converted to `webm` as [recommended by hower.js](https://github.com/goldfire/howler.js#format-recommendations):

```
ffmpeg -i 01.mp3 -dash 1 01.webm
```

Change the file to base64 (make sure it starts with `data:audio/webm` not `data:video/webm`).
