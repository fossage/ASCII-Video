#!/usr/bin/env node --harmony
'use strict'; 

/*=====================================================
                    IMPORTS / SETUP
======================================================*/
const _            = require('lodash');
const fs           = require('fs');
const clc          = require('cli-color');
const shell        = require('shelljs');
const program      = require('commander');
const logUpdate    = require('log-update');
const imageToAscii = require("image-to-ascii");

const tmpDirPath = '/tmp/__sprite_cli_output/';

/*=====================================================
                          MAIN
======================================================*/
program
  .version('0.0.1')
  .command('create <input-video> <output-filename>')
  .description('Takes an input video, converts it into ASCII frames, and writes it to an output file.')
  .action((video, outputTo) => {
    if(!_.endsWith(outputTo, '.js')) {
      return console.log(errMsg('The outputfile must be a Javascript file.'));
    }

    const dir             = process.cwd();
    const finishLoadingId = showLoading();
    
    // make temp directory to write image files to
    shell.exec(`cd /tmp && mkdir __sprite_cli_output && cd ${dir}`);

    if (shell.exec(`ffmpeg -i ${program.args[0]} ${tmpDirPath}image%d.jpg`).code !== 0) {
      // stop loading animation
      clearInterval(finishLoadingId);
      return console.log(errMsg('@todo: error message for shit went wrong.'))
    }

    // stop loading animation
    clearInterval(finishLoadingId);

    // ensure frames are in correct order
    const files = fs.readdirSync(tmpDirPath).sort((f1, f2) => {
      try {
        const fileOne = parseInt(f1.match(/\d/g).join(''));
        const fileTwo = parseInt(f2.match(/\d/g).join(''));
        return fileTwo - (fileOne + 1);
      } catch(e) {
        return 0
      }
    }).reverse();

    createSprites(files, outputTo, 0 , []);
  });

program
  .command('play <file>')
  .description('Plays back a generated sprite file')
  .option('-f, --frame_rate <rate>', 'A number which specifies the rate at which to iterate through the sprites')
  .action((pathToFile, opts) => {
    console.log(pathToFile)
    readFile(pathToFile)
    .then((data) => {
      let i = 0;
      const frames    = JSON.parse(data);
      const frameRate = (opts && opts.frame_rate) ? opts.frame_rate : 155;

      setInterval(() => {
        logUpdate(frames[i]);
        (i < frames.length - 1)
          ? i++
          : i = 0
      }, frameRate);
    });
  });
 
program.parse(process.argv);
if(!program.args.length) program.help();

/*=====================================================
                        HELPERS
======================================================*/
function createSprites(files, outputTo, idx, output) {
  if(idx === files.length) {
    const outFile = JSON.stringify(output);
      
    fs.writeFile(outputTo, outFile, (err) => {
      if(err) return console.log(warningMsg(err));

      // clean up temp directory after .js file has been written
      shell.exec(`rm -rf ${tmpDirPath}`)
      return console.log(infoMsg(`File written to ${outputTo}`));
    });
  } else {
    imageToAscii(tmpDirPath + files[idx], {
      image_type: 'jpg'
    }, (err, converted) => {
      if(err) {
        console.log(warningMsg(err));
      } else {
        output.push(converted);
        logUpdate(`Creating sprites: ${Math.round((idx / files.length) * 100)}%`);
      }

      createSprites(files, outputTo, idx + 1, output);
    });
  }
}

function showLoading() {
  const frames = ['-', '\\', '|', '/'];
  let i = 0;

  return setInterval(() => {
    const frame = frames[i = ++i % frames.length];
    logUpdate(`${frame} Converting video to frames ${frame}`);
  }, 80)
}

function readFile(pathTo) {
  return new Promise((resolve, reject) => {
    fs.readFile(pathTo, (err, data) => {
      if(!err) return resolve(data);
      console.log(err);
      reject(err);
    })
  });
}

function infoMsg(msg) {
  const infoColor = clc.xterm(33);
  return infoColor(msg);
}

function errMsg(msg) {
  const errColor = clc.xterm(9);
  return errColor(msg);
}

function warningMsg(msg) {
  const warningColor = clc.xterm(214);
  return warningColor(msg);
}