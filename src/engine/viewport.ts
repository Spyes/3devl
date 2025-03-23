import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { CanvasSize } from "../types"
import { getGeometryByType } from "./utils"
import state from "./state"
import { GameScene } from "./engine.types"

export default class Viewport {
  canvas: HTMLElement
  sizes: CanvasSize
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  camera: THREE.PerspectiveCamera
  controls: OrbitControls
  clock: THREE.Clock
  currentScene: number

  constructor(canvas: HTMLElement, sizes: CanvasSize) {
    this.canvas = canvas
    this.sizes = sizes

    this.clock = new THREE.Clock()
    this.scene = new THREE.Scene()

    this.renderer = new THREE.WebGLRenderer({ canvas })
    this.renderer.setSize(this.sizes.width, this.sizes.height)
  
    this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height)
    this.camera.position.z = 3
    this.scene.add(this.camera)

    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.enableDamping = true

    this.currentScene = 0

    this.renderScene()
    this.tick()
  }

  private renderScene() {
    const availableObjects = [...state.get().objects, ...state.get().scenes[this.currentScene].objects];
    state.get().scenes[this.currentScene].instances.forEach((instance) => {
      const object = availableObjects.find((object) => object.name === instance.name)
      if (object) {
        const geometry = getGeometryByType(object.type)
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(instance.position.x, instance.position.y, instance.position.z)
        this.scene.add(mesh)
      }
    })
  }

  private tick() {
    const elapsedTime = this.clock.getElapsedTime()
    this.renderer.render(this.scene, this.camera)
    window.requestAnimationFrame(this.tick.bind(this))
  }
}