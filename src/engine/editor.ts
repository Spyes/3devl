import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { CanvasSize } from "../types"
import { GameScene, GameState } from "./engine.types"
import { State } from "./state"
import { getGeometryByType } from "./utils"

export default class Editor {
  canvas: HTMLElement
  sizes: CanvasSize
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  camera: THREE.PerspectiveCamera
  controls: OrbitControls
  clock: THREE.Clock
  state: GameState

  currentScene: GameScene

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

    this.state = State
    this.currentScene = this.state.scenes[0]

    this.renderScene()
    this.renderObjectsPanel()
    this.tick()
  }

  private renderScene() {
    const availableObjects = [...this.state.objects, ...this.currentScene.objects];
    this.currentScene.instances.forEach((instance) => {
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

  private renderObjectsPanel() {
    const objectsPanelEl = document.getElementById('objects-panel')
    if (!objectsPanelEl) {
      return
    }
    this.state.objects.forEach((object) => {
      const element = document.createElement('div')
      element.innerHTML = object.name
      objectsPanelEl.appendChild(element)
    })
    this.currentScene.objects.forEach((object) => {
      const element = document.createElement('div')
      element.innerHTML = object.name
      objectsPanelEl.appendChild(element)
    })
  }

  private tick() {
    const elapsedTime = this.clock.getElapsedTime()
    this.renderer.render(this.scene, this.camera)
    window.requestAnimationFrame(this.tick.bind(this))
  }
}