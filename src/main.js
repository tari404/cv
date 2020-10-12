import Earth from '@tarii/3d-earth'
import Tree from './index.js'

import './style.styl'

const banner = document.querySelector('#banner')
if (banner) {
  const earth = new Earth({
    parent: banner,
    coords: [
      29.458349, 106.396826,
      39.804935, 114.973428,
      22.204878, 45.426417,
      10.106263, 39.144935,
      47.397837, 4.803222,
      41.997906, -1.405880,
      44.136586, 11.842139,
      38.935887, 16.504146,
      44.490049, 27.585049,
      39.062638, -78.335972,
      39.897687, -122.714527,
      9.171568, -66.633754,
      -15.47, -47.55,
      -35.15, 149.08,
      -18.06, 178.30,
      -6.09, 106.49
    ],
    minLineSpacing: 80,
    maxLineSpacing: 140,
    rotateSpeed: 0.001,
  })
  
  earth.start()
}

const parent = document.querySelector('.xmas-tree')
if (parent) {
  const tree = new Tree({
    parent
  })
  
  tree.start()
}

const throttle = (fn, time) => {
  let locked = false
  const tfn = function (...arg) {
    if (locked) return
    locked = true
    fn.call(this, ...arg)
    setTimeout(() => {
      locked = false
    }, time)
  }
  Object.defineProperty(tfn, 'locked', { get: () => locked })
  return tfn
}

const moveBg = document.querySelector('#more-bg')
const top = moveBg.getBoundingClientRect().top + window.scrollY
setTimeout(() => {
  moveBg.style.transition = 'filter .2s ease-out, background-position-x .1s'
}, 0)
const onScroll = () => {
  const dy = window.scrollY - top
  let dx = 50 + dy / 24
  dx = Math.min(Math.max(24, dx), 60)
  moveBg.style.backgroundPositionX = dx + '%'
}
onScroll()

window.addEventListener('scroll', throttle(onScroll, 30))
