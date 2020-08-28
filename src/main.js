const $siteList = $('.siteList')
const $lastLi = $siteList.find('li.last')
const $dialogMask = $('.dialog-mask')
const $modifyNameInput = $('.modify_name_input')
const $modifyUrlInput = $('.modify_url_input')

const history = JSON.parse(localStorage.getItem('history'))

// 判断输入框是否获取了焦点
let isInputFocus = false
let modifyObj = null
let hashMapActiveIndex

const hashMap = history || [
  { logo: 'V', url: 'https://cn.vuejs.org/', modified: false },
  { logo: 'R', url: 'https://react.docschina.org/', modified: false },
  { logo: 'J', url: 'https://jquery.cuishifeng.cn/', modified: false }
]

const simplyUrl = url => {
  return url.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/.*/, '') // 删除 / 开头的内容
}

const render = () => {
  $siteList.find('li:not(.last)').remove()
  hashMap.forEach((node, index) => {
    node.name = node.modified ? node.name : simplyUrl(node.url)
    let $li
    if (node.modified) {
      $li = $(`
        <li>
          <div class="site">
            <div class="logo">${node.logo}</div>
            <div class="link">${node.name}</div>
            <div class="point">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-point"></use>
              </svg>
            </div>
          </div>
        </li>
      `).insertBefore($lastLi)
    } else {
      $li = $(`
        <li>
          <div class="site">
            <div class="logo">${node.logo}</div>
            <div class="link">${simplyUrl(node.url)}</div>
            <div class="point">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-point"></use>
              </svg>
            </div>
          </div>
        </li>
      `).insertBefore($lastLi)
    }
    $li.on('click', () => {
      window.open(node.url)
    })
    $li.on('click', '.point', e => {
      e.stopPropagation()
      // 保存索引
      hashMapActiveIndex = index
      $dialogMask.show()
      modifyObj = {
        logo: hashMap[index].logo,
        url: hashMap[index].url,
        name: hashMap[index].name,
        modified: false
      }
      $modifyNameInput.val(hashMap[index].name)
      $modifyUrlInput.val(hashMap[index].url)
    })
  })
}

// 重置中间变量
const resetModifyObj = () => {
  modifyObj = null
  hashMapActiveIndex = undefined
}

render()

// 存储输入框获取焦点的状态
Array.from(document.getElementsByTagName('input')).forEach(input => {
  $(input).focus(() => (isInputFocus = true))
  $(input).blur(() => (isInputFocus = false))
})

$('.addButton').on('click', () => {
  let url = window.prompt('请问你要输入的网址是什么')
  if (!url) return
  if (url.indexOf('http') !== 0) {
    url = 'https://' + url
  }
  hashMap.push({
    logo: simplyUrl(url)[0],
    logoType: 'text',
    url: url
  })
  render()
})

$modifyNameInput.on('change', e => {
  modifyObj.name = $modifyNameInput.val()
  modifyObj.modified = true
})

$modifyUrlInput.on('change', e => {
  modifyObj.logo = simplyUrl($modifyUrlInput.val())[0]
  let url = $modifyUrlInput.val()
  if (url.indexOf('http') !== 0) {
    url = 'https://' + url
  }
  modifyObj.url = url
  modifyObj.modified = true
})

$('.cancel').on('click', () => {
  $dialogMask.hide('fast')
  resetModifyObj()
})
$('.remove').on('click', () => {
  hashMap.splice(hashMapActiveIndex, 1)
  $dialogMask.hide('fast')
  resetModifyObj()
  render()
})
$('.complete').on('click', () => {
  hashMap.splice(hashMapActiveIndex, 1, modifyObj)
  $dialogMask.hide('fast')
  resetModifyObj()
  render()
})

$(document).on('keypress', e => {
  const { key } = e
  for (let i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key && !isInputFocus) {
      window.open(hashMap[i].url)
    }
  }
})

window.onbeforeunload = () => {
  localStorage.setItem('history', JSON.stringify(hashMap))
}
