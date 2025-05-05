import Component, { ComponentClass } from "./component";
import Registry from "./registry";

interface IEntityConstructor {
  id: number;
  name?: string;
  registry: Registry;
}

export default class Entity {
  private _id: number;
  private _name: string;
  private _registry: Registry;

  constructor({ id, name, registry }: IEntityConstructor) {
    this._id = id;
    this._name = name || `entity_${id}`;
    this._registry = registry;
  }

  public get id() {
    return this._id;
  }

  public get name() {
    return this._name;
  }

  public AddComponent(component: Component): Entity {
    this._registry.AddComponent(this, component);
    return this;
  }

  public GetComponent<TComponent extends Component>(componentClass: ComponentClass<TComponent>): TComponent | undefined {
    return this._registry.GetComponent<TComponent>(this, componentClass);
  }

  public RemoveComponent<TComponent extends Component>(componentClass: ComponentClass<TComponent>): void {
    this._registry.RemoveComponent<TComponent>(this, componentClass);
  }

  public Destroy() {
    this._registry.RemoveEntity(this);
  }
}