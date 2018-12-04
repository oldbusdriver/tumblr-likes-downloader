const fs = require('fs')
const tumblr = require('tumblr.js')
const download = require('./downloader')
async function save(obj, filename) {
  return new Promise((res, rej) => {
    fs.writeFile(filename, JSON.stringify(obj), 'utf8', function(err) {
      if (err) {
        return console.log(err)
      }

      console.log(`${filename} was saved!`)
      res()
    })
  })
}

async function backup() {
  let result, photos
  try {
    result = require('./data')
  } catch (error) {
    result = {}
  }
  try {
    photos = require('./photos')
  } catch (error) {
    photos = {}
  }

  try {
    let client = tumblr.createClient({
      consumer_key: '',
      consumer_secret: '',
      token: '',
      token_secret: '',
    })
    client.returnPromises()
    function handler(ret) {
      ret.liked_posts.forEach(element => {
        const regexVideo = /data-npf='(.*)'/
        let { type, id, summary, body = null, video_url = null } = element
        if (body != null) {
          let res = regexVideo.exec(body)
          if (res == null || res.length < 2) {
            console.log(element.post_url)
            return
          }
          tmp = JSON.parse(res[1])
          if (tmp.type == 'video') {
            video_url = tmp.url
          } else {
            console.log(tmp)
          }
        }
        if (video_url == null && type == 'photo') {
          element.photos.forEach((p, idx) => {
            photos[`${element.blog_name}_${element.summary}_${idx}`] =
              p.original_size.url
          })
        } else {
          if (!(element.id in result) || result[element.id].video_url == null) {
            let final = {
              id: id,
              title: summary.length == 0 ? String(id) : summary,
              video_url,
            }
            result[element.id] = final
          }
        }
      })
    }
    let ret = await client.userLikes()
    for (;;) {
      if (!('_links' in ret)) break
      const { query_params = null } = ret._links.next
      if (query_params == null) break
      console.log(`current query_params:${JSON.stringify(query_params)}`)
      ret = await client.userLikes(query_params)
      handler(ret)
    }
  } catch (error) {
    console.log(error)
  } finally {
    await save(result, './data.json')
    await save(photos, './photos.json')
    return result
  }
}

backup().then(res => {
  download(res)
})
