import * as THREE from 'three'
import {
  Scene,
  WebGLRenderer,
  Mesh, Fog,
} from 'three'

const deg = Math.PI / 180
window.THREE = THREE

import customFS from './lib/custom.glsl.fs'
import customVS from './lib/custom.glsl.vs'

const points = [
  7.6803, 0,
  7.9947, .177,
  8.1378, .4368,
  8.1746, .8041,
  8.1280, 1.1273,
  8.0145, 1.6024,
  7.8094, 2.015,
  7.3879, 2.4165,
  7.0403, 2.6865,
  6.4336, 3.0534,
  5.9561, 3.2776,
  5.3763, 3.5078,
  4.8603, 3.7947,
  4.3319, 4.1875,
  3.9247, 4.4957,
  3.3971, 4.9772,
  3.0450, 5.4317,
  2.6347, 5.9770,
  2.3127, 6.51,
  2.0269, 7.1149,
  1.7123, 7.6632,
  1.4248, 8.16,
  1.0518, 8.6951,
  .8843, 8.9334,
  .7218, 9.1166,
  .3519, 9.3641,
  .1953, 9.4346,
  0, 9.4558
]

export default class Tree {
  constructor (options) {
    if (!(options.parent instanceof HTMLElement)) {
      throw new Error('[Tree] A correct DOM node must be provided!')
    }
    
    this.parent = options.parent
    this.o = options
    this.init()
  }
    
  init () {
    // const camera = new THREE.OrthographicCamera(100, 100, 100, -100)
    const camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 0.1, 1000)
    camera.position.set(0, -400, 0)
    camera.lookAt(0, 0, 0)
    const scene = new Scene()
    scene.fog = new Fog(this.o.fogColor || 0x151a28, 400, 600)
    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: true
    })
    renderer.setClearColor(0x0f1418)
    renderer.setPixelRatio(devicePixelRatio)

    // new TextureLoader().load(require('./assets/bg.jpg'), texture => {
    //   const bg = new Mesh(
    //     new THREE.PlaneBufferGeometry(200, 200),
    //     new THREE.MeshBasicMaterial({
    //       map: texture,
    //       opacity: 0,
    //       transparent: true
    //     })
    //   )
    //   bg.position.y = -2
    //   bg.position.x = -1
    //   bg.rotateX(90 * deg)
    //   scene.add(bg)
    // })

    const sLight = new THREE.SpotLight(0xffffff, 0.1, 500)
    sLight.position.set(120, -20, -80)
    sLight.lookAt(0, 0, 0)
    scene.add(sLight)

    const material = new THREE.MeshStandardMaterial({
      metalness: 0,
      roughness: 0.7,
      emissive: 0x0f1418
    })
    material.onBeforeCompile = shader => {
      shader.fragmentShader = customFS
      shader.vertexShader = customVS
    }

    const ball = new Mesh(
      new THREE.OctahedronBufferGeometry(8.5, 4),
      material
    )
    ball.position.set(0, 0, 78.8)

    const layer1 = new Mesh(
      new THREE.TorusBufferGeometry(7.6, 3.2, 32, 64),
      material
    )
    layer1.scale.z = 0.76
    layer1.rotation.x = 32 * deg
    layer1.rotation.z = -18 * deg
    layer1.rotation.order = 'ZXY'
    layer1.position.set(0, 0, 54)

    const layer2 = new Mesh(
      new THREE.TorusBufferGeometry(14.2, 3.4, 32, 64),
      material
    )
    layer2.scale.z = 0.76
    layer2.rotation.x = 26 * deg
    layer2.rotation.z = 32 * deg
    layer2.rotation.order = 'ZXY'
    layer2.position.set(0, 0, 29.4)

    const layer3 = new Mesh(
      new THREE.TorusBufferGeometry(27.8, 3.7, 32, 64),
      material
    )
    layer3.scale.z = 0.76
    layer3.rotation.x = 24 * deg
    layer3.rotation.z = -26 * deg
    layer3.rotation.order = 'ZXY'
    layer3.position.set(0, 0, -1.4)

    const layer4 = new Mesh(
      new THREE.TorusBufferGeometry(44.8, 4.2, 32, 64),
      material
    )
    layer4.scale.z = 0.76
    layer4.rotation.x = 18 * deg
    layer4.rotation.z = 28 * deg
    layer4.rotation.order = 'ZXY'
    layer4.position.set(0, 0, -43.6)

    const line = []
    for (let i = 0; i < points.length; i += 2) {
      line.push(new THREE.Vector2(points[i], points[i + 1]))
    }
    const bottom = new Mesh(
      new THREE.LatheBufferGeometry(line, 32),
      material
    )
    bottom.rotation.x = 90 * deg
    bottom.position.z = -86.4
    bottom.scale.set(1.35, 1.12, 1.35)

    scene.add(ball)
    scene.add(layer1)
    scene.add(layer2)
    scene.add(layer3)
    scene.add(layer4)
    scene.add(bottom)

    this.scene = scene
    this.renderer = renderer
    this.camera = camera

    this.timer = 0

    this.onresize = () => {
      const rect = this.parent.getBoundingClientRect()

      const k = rect.width / rect.height
      // this.camera.left = - 100 * k;
      // this.camera.right = 100 * k;
      // this.camera.updateProjectionMatrix()

      // this.camera.position.set(0, -230, 0)
      // this.camera.lookAt(0, 0, 0)

      this.camera.aspect = k
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(rect.width, rect.height)
    }

    this.render = () => {
      this.timer++

      // layer1.rotation.z += 0.02
      // layer2.rotation.z -= 0.015
      // layer3.rotation.z += 0.012
      // layer4.rotation.z -= 0.01
      layer1.rotation.z += 0.01
      layer2.rotation.z += 0.01
      layer3.rotation.z += 0.01
      layer4.rotation.z += 0.01
      this.renderer.render(this.scene, this.camera)
      this.raf = requestAnimationFrame(this.render)
    }
  }

  start () {
    window.addEventListener('resize', this.onresize)
    this.onresize()

    const mainCanvas = this.renderer.domElement
    mainCanvas.id = 'webgl-container'
    this.parent.appendChild(this.renderer.domElement)
    this.raf = requestAnimationFrame(this.render)
  }

  stop () {
    if (this.raf) {
      cancelAnimationFrame(this.raf)
    }
    window.removeEventListener('resize', this.onresize)
    this.parent.removeChild(this.renderer.domElement)
  }
}
