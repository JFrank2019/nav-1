const $siteList = $('.siteList')
const $lastLi = $siteList.find('li.last')

const history = JSON.parse(localStorage.getItem('history'))

const hashMap = history || [
  { logo: 'V', url: 'https://cn.vuejs.org/' },
  { logo: 'R', url: 'https://react.docschina.org/' },
  { logo: 'J', url: 'https://jquery.cuishifeng.cn/' }
]

const simplyUrl = url => {
  return url.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/.*/, '') // 删除 / 开头的内容
}

const render = () => {
  $siteList.find('li:not(.last)').remove()
  hashMap.forEach((node, index) => {
    const $li = $(`
      <li>
        <div class="site">
          <div class="logo">${node.logo}</div>
          <div class="link">${simplyUrl(node.url)}</div>
          <div class="close">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-close"></use>
            </svg>
          </div>
        </div>
      </li>
    `).insertBefore($lastLi)
    $li.on('click', () => {
      window.open(node.url)
    })
    $li.on('click', '.close', e => {
      e.stopPropagation()
      hashMap.splice(index, 1)
      render()
    })
  })
}

render()

$('.addButton').on('click', () => {
  let url = window.prompt('请问你要输入的网址是什么')
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

window.onbeforeunload = () => {
  localStorage.setItem('history', JSON.stringify(hashMap))
}

$(document).on('keypress', e => {
  const { key } = e
  for (let i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key) {
      window.open(hashMap[i].url)
    }
  }
})
