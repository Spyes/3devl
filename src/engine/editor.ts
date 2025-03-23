import { CanvasSize } from "../types"
import Viewport from "./viewport"

export default class Editor {
  constructor(canvas: HTMLElement, sizes: CanvasSize) {
    new Viewport(canvas, sizes)
    this.renderObjectsPanel()
  }

  private renderObjectsPanel() {
    
  }
}