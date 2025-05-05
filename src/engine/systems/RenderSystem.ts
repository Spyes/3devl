import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import System from "../system";
import TransformComponent from "../components/TransformComponent";
import Entity from "../entity";
import Renderer from "../gfx";
import MeshComponent from "../components/MeshComponent";

export default class RenderSystem extends System {
  public componentsRequired = new Set<Function>([TransformComponent, MeshComponent]);
  public entities = new Set<Entity>();

  private _meshes = new Map<number, Mesh>();

  Update(): void {
    for (const entity of this.entities) {
      const meshComponent = entity.GetComponent(MeshComponent);
      const transformComponent = entity.GetComponent(TransformComponent);
      if (!meshComponent || !transformComponent) continue;
      let mesh = this._meshes.get(entity.id);
      if (!mesh) {
        mesh = new Mesh(meshComponent.geometry, meshComponent.material);
        this._meshes.set(entity.id, mesh);
        meshComponent.mesh = mesh;
      }
      const { position } = transformComponent;
      mesh.position.set(position.x, position.y, position.z);
      Renderer.scene.add(mesh);
    }
  }

  public OnRemoveEntity(entity: Entity): void {
    Renderer.scene.remove(this._meshes.get(entity.id) as Mesh);
    this._meshes.delete(entity.id);
  }
}