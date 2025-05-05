import { Box3 } from "three";
import BoxColliderComponent from "../components/BoxColliderComponent";
import TransformComponent from "../components/TransformComponent";
import Entity from "../entity";
import System from "../system";
import MeshComponent from "../components/MeshComponent";

export default class CollisionSystem extends System {
  public componentsRequired = new Set<Function>([TransformComponent, MeshComponent, BoxColliderComponent]);
  public entities = new Set<Entity>();

  private _collisionBoxes = new Map<Entity, Box3>();

  public Update(): void {
    for (const entityA of this.entities) {
      const boxColliderComponentA = entityA.GetComponent(BoxColliderComponent);
      const meshComponent = entityA.GetComponent(MeshComponent);
      if (!boxColliderComponentA || !meshComponent || !meshComponent.mesh) continue;
      let boundingBoxA = this._collisionBoxes.get(entityA);
      if (!boundingBoxA) {
        boundingBoxA = (new Box3()).setFromObject(meshComponent.mesh);
        this._collisionBoxes.set(entityA, boundingBoxA);
      }
      boundingBoxA.copy(meshComponent.mesh.geometry.boundingBox as Box3).applyMatrix4(meshComponent.mesh.matrixWorld);

      for (const entityB of this.entities) {
        if (entityA.id === entityB.id) continue;
        const boxColliderComponentB = entityB.GetComponent(BoxColliderComponent);
        const meshComponent = entityB.GetComponent(MeshComponent);
        if (!boxColliderComponentB || !meshComponent || !meshComponent.mesh) continue;
        let boundingBoxB = this._collisionBoxes.get(entityB);
        if (!boundingBoxB) {
          boundingBoxB = (new Box3()).setFromObject(meshComponent.mesh);
          this._collisionBoxes.set(entityB, boundingBoxB);
        }
        if (boundingBoxA.intersectsBox(boundingBoxB)) {
          boxColliderComponentA.onCollision(entityB);
        }
      }
    }
  }
}