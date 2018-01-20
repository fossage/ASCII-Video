#!/usr/bin/env node --harmony

/*=====================================================
                    IMPORTS / SETUP
======================================================*/
const _ = require('lodash')
const fs = require('fs')
const yaml = require('js-yaml')
const clc = require('cli-color')
const shell = require('shelljs')
const program = require('commander')
const logUpdate = require('log-update')
const imageToAscii = require('image-to-ascii')

const TMP_DIR_PATH = '/tmp/__sprite_cli_output/'
const END_OF_FRAME_ID = '\nzzzzzzzzzzzzzzzzzzzzzzz'
/*=====================================================
                          MAIN
======================================================*/
program
  .version('0.1.2')
  .command('create <input-video> <output-filename>')
  .description(
    'Takes an input video, converts it into ASCII frames, and writes it to an output file.'
  )
  .action((video, outputTo) => {
    if (!_.endsWith(outputTo, '.yaml')) {
      return console.log(errMsg('The outputfile must be a yaml file.'))
    }

    // remove the output file if it exists already
    if (fs.existsSync(outputTo)) {
      fs.unlinkSync(outputTo)
    }

    const dir = process.cwd()
    const finishLoadingId = showLoading()

    // make temp directory to write image files to
    shell.exec(`cd /tmp && mkdir __sprite_cli_output && cd ${dir}`)

    if (
      shell.exec(`ffmpeg -i ${program.args[0]} ${TMP_DIR_PATH}image%d.jpg`)
        .code !== 0
    ) {
      // stop loading animation
      clearInterval(finishLoadingId)
      return console.log(errMsg('@todo: error message for shit went wrong.'))
    }

    // stop loading animation
    clearInterval(finishLoadingId)

    // ensure frames are in correct order
    const files = fs
      .readdirSync(TMP_DIR_PATH)
      .sort((f1, f2) => {
        try {
          const fileOne = parseInt(f1.match(/\d/g).join(''))
          const fileTwo = parseInt(f2.match(/\d/g).join(''))
          return fileTwo - (fileOne + 1)
        } catch (e) {
          return 0
        }
      })
      .reverse()

    createSprites(files, outputTo, 0, [])
  })

program
  .command('play <file>')
  .description('Plays back a generated sprite file')
  .option(
    '-f, --frame_rate <rate>',
    'A number which specifies the rate at which to iterate through the sprites'
  )
  .action((pathToFile, opts) => {
    console.log(pathToFile)
    const lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(pathToFile),
    })

    let frame = ''
    const re = RegExp(END_OF_FRAME_ID, 'g')
    const frameRate = opts && opts.frame_rate ? opts.frame_rate : 155

    lineReader.on('line', async line => {
      lineReader.pause()
      const fragment = yaml.safeLoad(line)[0]
      frame += fragment

      if (re.test(frame)) {
        const frames = frame.split(END_OF_FRAME_ID)
        for (let frameItem of frames) {
          await delay(frameRate)
          if (frameItem.length) logUpdate(frameItem)
        }

        frame = ''
      }

      lineReader.resume()
    })
  })

program.parse(process.argv)
if (!program.args.length) program.help()

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

/*=====================================================
                        HELPERS
======================================================*/
function createSprites(files, outputTo, idx, sprites) {
  if (idx === files.length) {
    appendToFile(outputTo, sprites, true)
    // clean up temp directory after the last chunk of sprites is written
    shell.exec(`rm -rf ${TMP_DIR_PATH}`)
    console.log(infoMsg(`File written to ${outputTo}`))
  } else {
    imageToAscii(
      TMP_DIR_PATH + files[idx],
      {
        image_type: 'jpg',
      },
      (err, converted) => {
        if (err) {
          console.log(warningMsg(err))
        } else {
          sprites.push(converted + '\nzzzzzzzzzzzzzzzzzzzzzzz')

          // write to disk before sprites array gets too large
          if (sprites.length > 500) {
            appendToFile(outputTo, sprites)
            sprites = []
          }

          logUpdate(
            `Creating sprites: ${Math.round(idx / files.length * 100)}%`
          )
        }

        createSprites(files, outputTo, idx + 1, sprites)
      }
    )
  }
}

function appendToFile(outputTo, sprites) {
  const outFile = yaml.safeDump(sprites)

  fs.appendFile(outputTo, outFile, err => {
    if (err) return console.log(warningMsg(err))
  })
}

function showLoading() {
  const frames = ['-', '\\', '|', '/']
  let i = 0

  return setInterval(() => {
    const frame = frames[(i = ++i % frames.length)]
    logUpdate(`${frame} Converting video to frames ${frame}`)
  }, 80)
}

function readFile(pathTo) {
  return new Promise((resolve, reject) => {
    fs.readFile(pathTo, (err, data) => {
      if (!err) return resolve(data)
      console.log(err)
      reject(err)
    })
  })
}

function infoMsg(msg) {
  const infoColor = clc.xterm(33)
  return infoColor(msg)
}

function errMsg(msg) {
  const errColor = clc.xterm(9)
  return errColor(msg)
}

function warningMsg(msg) {
  const warningColor = clc.xterm(214)
  return warningColor(msg)
}
