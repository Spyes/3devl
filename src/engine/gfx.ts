import { PerspectiveCamera, Scene, WebGLRenderer } from "three";


export default class GFX {
  private static _canvas: HTMLCanvasElement
  private static _renderer: WebGLRenderer;
  private static _camera: PerspectiveCamera;
  private static _scene: Scene;

  public static get renderer() { return GFX._renderer; }
  public static get scene() { return GFX._scene; }

  static initialize() {
    this._canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

    this._renderer = new WebGLRenderer({ canvas: this._canvas });
    this._renderer.setSize(800, 600);
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));  

    const aspectRatio = 800 / 600;
    this._camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
    
    this._scene = new Scene();
    this._scene.add(this._camera);
  }

  static render() {
    this.renderer.render(this._scene, this._camera);
  }
}