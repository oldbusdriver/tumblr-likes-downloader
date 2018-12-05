const fs = require('fs')
const download = require('download')
async function _download(videos) {
  let keys = Object.keys(videos)
  let folder = './videos'
  if (!fs.existsSync(folder)) {
    console.log(`create ${folder}`)
    fs.mkdirSync(folder)
  }

  for (let key of keys) {
    let { id, title, video_url } = videos[key]
    if (video_url == null) continue
    title = title ? title.replace(/\n|\s|\//g, '') : title
    let filePath = `${folder}/${title}_${id}.mp4`
    if (!fs.existsSync(filePath)) {
      try {
        console.log(`downloading ${filePath} ${video_url}`)
        let data = await download(video_url)
        fs.writeFileSync(filePath, data)
        console.log(`download ${filePath} success`)
      } catch (error) {
        console.log(`${video_url} ${error}`)
      }
    } else {
      console.log(`${filePath} exist skip.`)
    }
  }
}

module.exports = _download
