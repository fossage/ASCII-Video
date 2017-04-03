# ASCII Video


## What is it

ASCII Video is a command line tool which allows you to convert movies into ASCII sprite sheets and then play them back in the terminal. It uses [ffmpeg](https://ffmpeg.org/) to break up the video into a series of images, which then are converted to individual ASCII art frames using [image-to-ascii](https://github.com/IonicaBizau/image-to-ascii).  It then builds those frames up into a Javascript array as text, and writes the resulting array to an output file that can then be read in by the program and played back in the terminal with the help of [log-update](https://github.com/sindresorhus/log-update).

![ASCII Video is Magic](./out.gif?raw=true "Demo Video")

## Why would you make this

Because I can. Yes the file size is larger than an mp4. Yes the resolution is terrible. Yes there is no audio. It was just fun to make.

## What would I ever use this for

For me personally, I just use it to make things that make me laugh. If that is not a good enough reason to do something with it, you should use it for:

* A kick ass loading animation for you CLI tool
* An awesome command line based game with cut scenes
* To show your friends who code who 1337 you are. (That means "[leet](https://www.youtube.com/watch?v=dQw4w9WgXcQ)" which I don't really understand, but I hear it's fun for young people.)
* Put all of your hippest friends to shame when you tell them you don't watch movies anymore, but instead you download text files that are 50 times larger than a regular movie file that you can only watch in a Unix type command line environment. They won't know what you're talking about, but rest assured, they will think you are super cool.

## How do I get it (installation)

1. If you're on a Mac, the easiest way to get the initial dependencies is through [Homebrew](https://brew.sh/).  If you're not on a Mac then you'll have to figure out how to load the initial dependencies on your machine, but everything after installing Node and FFMPEG should be the same.

1. Next you need to install [ffmpeg](https://ffmpeg.org/) by running:
    ```bash
    brew update && brew install ffmpeg
    ```
1. If you do not have [node](https://nodejs.org/en/), install it by running:
    ```bash
    brew update && brew install node
    ```
1. Node comes with a package manager called NPM. To install [ASCII-Video](https://github.com/fossage/ASCII-Video) run:
    ```bash
    npm install ascii-video
    ```
    Alternatively, you can just simply clone the repo from github, and then install the projects dependencies by navigating to the cloned repo and running:
    ```bash
    npm install
    ```

1. Next, navigate to the ASCII-Video directory within the node_modules directory and run:
    ```bash
    npm link
    ```
    This will allow you to run the program the same way you would any other bash program from anywhere on the machine.

## How do I use it

There are two commands that you use with `ascii-vido`; the `create` command and the `play` command.

### The `create` command

```bash
ascii-video create <[path/to/]input-video> <[path/to/]ouput-filename.js>
```

I.E.

```bash
ascii-video create ~/Documents/foo.mov ~/Documents/ascii-video-output/foo.js
```

Both the input video and output filename are required.  Note that is should be able to convert most all video formats so there is no strict specification.  Both the input video and output filename can be preceeded with a relative or absolute path, but if any path is ommitted, then the program will assume you are referring to the current working directory.

One other thing to note is that the ouput filename MUST be a Javascript file.

Lastly, note that currently the way the program will figure out what size to make the video is by determining the size of your terminal window when the command is run.  If you would like a larger, more detailed video, simply make your terminal window larger and vice-versa.

### The `play` command

```bash
ascii-video play <[path/to/]filename> [ --frame_rate <number>]
```

I.E.

```bash
ascii-video play ~/Documents/ascii-video-output/foo.js --frame_rate 20
```

This command will play back a Javascript file that was created with the `create` command. You will likely want to use the `--frame_rate` flag, or just `-f` for shorthand, because I have found that different videos seem to vary pretty widely on what seems like an acceptable framerate.  It is defaulted to 155, but I will often find myself running it as low as 5 for some videos and as much as 200 for others.  Just play around until you find a setting for your particular video that works.

Also, as mentioned in the create section, the size of the video is determined by the size of your terminal window at the time when you run the `create` command, so to ensure that it plays back in the correctly sized viewport, it is best to run `play` in the same terminal window(or at least on of the same size/aspect ratio) as the one in which the input file was created.

## @TODO:

* Add option flags to `create` to allow user to specify width and height of video
* Add flag to `create` to allow user to turn color encoding on/off
* Add flag to `play` command to toggle looping on/off


If you have any other improvements you would like to see, please feel free to submit a feature request.  Also, if you make any neat projects using this, please let me know so I can feature them on the README.  Thanks!



