# ASCII Video


## What is it

ASCII Video is a command line tool which allows you to convert movies into ASCII sprite sheets and then play them back in the terminal. It uses [ffmpeg](https://ffmpeg.org/) to break up the video into a series of images, which then [image-to-ascii](https://github.com/IonicaBizau/image-to-ascii) converts those images to ASCII art which it builds up in a Javascript array, and writes the resulting array to an output file. That file can then be read in by the program and played back in the terminal with the help of [log-update](https://github.com/sindresorhus/log-update).

![ASCII Video is Magic](./out.gif?raw=true "Demo Video")

## Why would you make this

Because I can. Yes the file size is larger than an mp4. Yes the resolution is terrible. Yes there is no audio. It was just fun to make.

## What would I ever use this for

For me personally, I just use it to make things that make me laugh. If that is not a good enough reason to do something with it, you should use it for:

* A kick ass loading animation for you CLI tool
* An awesome command line based game with cut scenes
* To show your friends who code who 1337 you are. (That means "[leet](https://www.youtube.com/watch?v=dQw4w9WgXcQ)" which I don't really understand, but I hear it's fun for young people.)
* Put all of your hipest friends to shame when you tell them you don't watch movies anymore, but instead you download text files that are 50 times larger than a regular movie file that you can only watch in a Unix type command line environment. They won't know what you're talking about, but rest assured, they will think you are super cool.

## How do I use it(Installation)

1. The first thing you have to do is be on a Mac and install [Homebrew](https://brew.sh/).

    If you're on a Linux machine, you probably know something that is way better than Homebrew and can't wait to tell the rest of us about how awful our lame package managers are.

    If you're on a PC, a package manager is a thing that you can use to install software through a thing called a terminal which is like Word but it does stuff.

    In the case that you do own a Mac, yea you might have a second mortgage, but you also have 16Gb of no holds barred, ass kicking, bicep shredding, not f-ing around memory so to heck with them haters...

    16 whole gigs...

2. Next you need to install [ffmpeg](https://ffmpeg.org/) by running:
    ```bash
    brew install ffmpeg
    ```
3. If you do not have [node](https://nodejs.org/en/) then get your life and run:
    ```bash
    brew install node
    ```
4. Node comes with a package manager called NPM. To install [ASCII-Video](https://github.com/fossage/ASCII-Video) run:
    ```bash
    npm install ascii-video
    ```



