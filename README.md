# Sprite CLI


## What is it

Sprite CLI is a command line tool which allows you to convert movies into ASCII sprite sheets and then play them back in the terminal.  It uses a combination of [ffmpeg](https://ffmpeg.org/) and [image-to-ascii](https://github.com/IonicaBizau/image-to-ascii) to break up a video into a series of images, then convert those images to ASCII art which it builds up in a javascript array and writes the resulting array to an output file which can later be read in by the program any played back in the terminal with the help of [log-update](https://github.com/sindresorhus/log-update).

![Sprite CLI is Magic](./out.gif?raw=true "Demo Video")