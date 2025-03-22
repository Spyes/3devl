import { CanvasSize } from './types'
import Editor from './engine/editor'

const canvas = document.querySelector('canvas.webgl') as HTMLElement
if (!canvas) {
  throw new Error('Canvas not found')
}

const sizes: CanvasSize = {
  width: 650,
  height: window.innerHeight,
}

const editor = new Editor(canvas, sizes)