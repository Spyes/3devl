import * as THREE from 'three'
import { CanvasSize } from './types';
import { GameScene, GameState } from './engine/engine.types';

export default class Game {
  sizes: CanvasSize
  canvas: Element
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  camera: THREE.PerspectiveCamera
  clock: THREE.Clock
  state: GameState

  currentScene: GameScene

  constructor(canvas: Element, sizes: CanvasSize, state: GameState) {
    this.sizes = sizes
    this.canvas = canvas
    this.state = state

    this.clock = new THREE.Clock()
    this.scene = new THREE.Scene()

    this.renderer = new THREE.WebGLRenderer({ canvas })
    this.renderer.setSize(this.sizes.width, this.sizes.height)

    this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height)
    this.camera.position.z = 3
    this.scene.add(this.camera)

    this.currentScene = this.state.scenes[0]

    window.addEventListener('resize', this.onResize.bind(this))
  }

  private onResize() {
    this.sizes.width = window.innerWidth
    this.sizes.height = window.innerHeight
    this.camera.aspect = this.sizes.width / this.sizes.height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  private getGeometryByType(type: string): THREE.BufferGeometry {
    switch (type.toLowerCase()) {
      case 'box':
        return new THREE.BoxGeometry(0.2, 0.2, 0.2)
      case 'sphere':
        return new THREE.SphereGeometry(0.2, 32, 32)
      default:
        throw new Error(`Unknown geometry type: ${type}`)
    }
  }

  start() {
    const availableObjects = [...this.state.objects, ...this.currentScene.objects];
    this.currentScene.instances.forEach((instance) => {
      const object = availableObjects.find((object) => object.name === instance.name)
      if (object) {
        const geometry = this.getGeometryByType(object.type)
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(instance.position.x, instance.position.y, instance.position.z)
        this.scene.add(mesh)
      }
    })
    this.tick()
  }

  tick() {
    const elapsedTime = this.clock.getElapsedTime()
    this.renderer.render(this.scene, this.camera)
    window.requestAnimationFrame(this.tick.bind(this))
  }

}
