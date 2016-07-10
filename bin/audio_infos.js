#!/usr/bin/env node
const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');

const argv = process.argv.slice(2);
if (argv.length !== 2) {
    console.log(`usage: audio_infos [WEBROOT] [AUDIO_FOLDER]`)
    process.exit(1);
}

function readdir(path) {
    return new Promise(function (resolve, reject) {
        fs.readdir(path, function (err, files) {
            if (err) {
                return reject(err);
            }

            resolve(files);
        });
    });
}

function getAudioInfo(file) {
    return new Promise(function (resolve, reject) {
        exec(`ffprobe -print_format json -show_format ${file}`, function (err, stdout) {
            if (err) {
                return reject(err);
            }

            const format = JSON.parse(stdout).format;
            resolve({
                duration: parseFloat(format.duration),
                path: format.filename,
                size: parseInt(format.size, 10),
            });
        });
    });
}

function writeFile(file, content) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(file, content, function (err) {
            if (err) {
                return reject(err);
            }

            resolve();
        });
    });
}

const webroot = path.resolve(process.cwd(), argv[0]);
const audioroot = path.resolve(process.cwd(), argv[1]);
const pathInWeb = path.relative(webroot, audioroot);

const validExts = /\.(mp3)$/i;
readdir(audioroot)
    .then(function (files) {
        const audioFilePromises = files
            .filter(function (file) { return !!file.match(validExts); })
            .map(function (audioFile) {
                return getAudioInfo(path.join(audioroot, audioFile)).then(function (infos) {
                    debugger;
                    return {
                        name: audioFile.replace(/[_]{1,}/, ' ').replace(/\..+$/, ''),
                        url: path.join(pathInWeb, audioFile),
                        duration: infos.duration,
                        size: infos.size,
                    };
                });
            });

        return Promise.all(audioFilePromises);
    })
    .then(function (audioFiles) {
        return writeFile(path.join(audioroot, "index.json"), JSON.stringify(audioFiles, null, 2));
    })
    .catch(function (err) {
        console.error(err);
        process.exit(1);
    });
