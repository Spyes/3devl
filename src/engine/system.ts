import Entity from "./entity";
import Registry from "./registry";

export default abstract class System {
  public abstract componentsRequired: Set<Function>;
  public abstract entities: Set<Entity>;

  constructor(protected _registry: Registry) {}

  public Update?(...args: any[]): void;
  public OnRemoveEntity?(entity: Entity): void;
}