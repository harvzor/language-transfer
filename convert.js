/*
 * Convert files taken from SoundCloud (mp3 files) to webm files, then convert them to base64.
 */

const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

const ffmpeg = require('fluent-ffmpeg')

const inputPath = __dirname + "/ClientApp/public/audio/german/"
const acceptFileType = ".mp3"
const outputFileType = '.webm'

let fileToBase64 = (filePath, fileBaseName, callback) => {
    let data = fs.readFileSync(filePath)

    let base64 = `data:audio/${outputFileType.replace('.', '')};base64,` + data.toString('base64')

    fs.writeFileSync(inputPath + fileBaseName, base64)

    callback()
}

fs.readdir(inputPath, (err, files) => {
    if (err)
        throw err

    files
        .filter(fileName => path.extname(fileName) === acceptFileType)
        .forEach(fileName => {
            let fileBaseName = path.basename(fileName, acceptFileType)
            let inputFilePath = inputPath + fileName
            let outputFilePath = inputPath + fileBaseName + outputFileType

            ffmpeg(inputFilePath)
                .addOption('-dash 1')
                .on('end', () => {
                    console.log(`converted ${fileName} to ${outputFileType}`)

                    fileToBase64(outputFilePath, fileBaseName, () => {
                        console.log(`converted ${fileName} to base64`)
                    })
                })
                .on('error', () => {
                    console.log('error converting ${fileName}')
                })
                .save(outputFilePath)
        })
})
