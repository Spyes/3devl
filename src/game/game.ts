import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, SphereGeometry, Vector3, WebGLRenderer } from "three";
import TransformComponent from "../engine/components/TransformComponent";
import Registry from "../engine/registry";
import MeshComponent from "../engine/components/MeshComponent";
import GFX from "../engine/gfx";
import InputComponent from "../engine/components/InputComponent";
import Entity from "../engine/entity";
import Time from "../engine/time";
import BoxColliderComponent from "../engine/components/BoxColliderComponent";

const desiredFPS = 1000 / 60;

export class Game {
  private _registry: Registry;
  private _lastTime: number = 0;

  constructor() {
    this._registry = new Registry();
    this._registry.Initialize();
  }

  Initialize() {
    GFX.initialize();
  }

  LoadJSON({ objects }) {
    objects.forEach(({ name, components }) => {
      const entity = this._registry.CreateEntity(name);
      components.forEach(({ type, values }) => {
        entity.AddComponent(new type(...values));
      })
    });

    window.requestAnimationFrame(this.Run.bind(this));
  }

  LoadLevel() {
    this._registry
      .CreateEntity('Cube')
      .AddComponent(new TransformComponent(new Vector3(0, 0, -5), new Vector3, 0))
      .AddComponent(new MeshComponent(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: '#152627', wireframe: true })))
      .AddComponent(new InputComponent(this.GetKeyState))
      .AddComponent(new BoxColliderComponent((other: Entity) => console.log('Cube: ', other)));

    this._registry
      .CreateEntity('Sphere')
      .AddComponent(new TransformComponent(new Vector3(2, 2, -5), new Vector3, 0))
      .AddComponent(new MeshComponent(new SphereGeometry(1), new MeshBasicMaterial({ color: 'red', wireframe: true })))
      .AddComponent(new BoxColliderComponent((other: Entity) => console.log('Sphere: ', other)));

    window.requestAnimationFrame(this.Run.bind(this));
  }

  Run(now: number) {
    window.requestAnimationFrame(this.Run.bind(this));

    if (!this._lastTime) { this._lastTime = now; }
    const elapsed = now - this._lastTime;
    Time.deltaTime = elapsed / 100;

    if (elapsed > desiredFPS) {
      this._registry.Update();
      GFX.render();
      this._lastTime = now;
    }
  }

  GetKeyState(keyState: Record<string, boolean>, entity: Entity) {
    const transformComponent = entity.GetComponent(TransformComponent);
    if (!transformComponent) return;

    const velocity = new Vector3();

    if (keyState.w) {
      velocity.y = 1;
    } else if (keyState.s) {
      velocity.y = -1;
    }

    if (keyState.a) {
      velocity.x = -1;
    } else if (keyState.d) {
      velocity.x = 1;
    }

    velocity.normalize().multiplyScalar(Time.deltaTime)
    transformComponent.position.add(velocity);
  }
}