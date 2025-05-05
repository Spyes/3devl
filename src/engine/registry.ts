import { Vector3 } from "three";
import Component, { ComponentClass } from "./component";
import TransformComponent from "./components/TransformComponent";
import Entity from "./entity";
import System from "./system";
import RenderSystem from "./systems/RenderSystem";
import InputSystem from "./systems/InputSystem";
import CollisionSystem from "./systems/CollisionSystem";

type Pool = Map<Entity['id'], Component>; /* Entity ID to Component object (data) */

type ComponentType = Function;
type SystemType = Function;

export default class Registry {
  private _numOfEntities;
  private _entitiesToBeAdded: Entity[];
  private _entitiesToBeRemoved: Entity[];
  private _freeIds: Entity['id'][];
  private _componentPools: Map<ComponentType, Pool>; /* Component ID to Pool */
  private _entities: Map<Entity['id'], Set<ComponentType>>;  /* entity ID to Component IDs */
  private _systems: Map<SystemType, System>;  /* System ID to System object */

  constructor() {
    this._numOfEntities = 0;
    this._entitiesToBeAdded = [];
    this._entitiesToBeRemoved = [];
    this._freeIds = [];

    this._componentPools = new Map<ComponentType, Pool>();
    this._entities = new Map<Entity['id'], Set<ComponentType>>();
    this._systems = new Map<SystemType, System>();
  }

  Initialize() {
    this.AddSystem(new RenderSystem(this));
    this.AddSystem(new InputSystem(this));
    this.AddSystem(new CollisionSystem(this));
  }

  AddSystem(system: System) {
    this._systems.set(system.constructor, system);
  }

  CreateEntity(name?: string, position: Vector3 = new Vector3()): Entity {
    let id = this._freeIds.shift();
    if (id === undefined) {
      id = this._numOfEntities++;
    }
    const entity = new Entity({ id, name, registry: this });
    this._entities.set(entity.id, new Set<ComponentType>());
    this._entitiesToBeAdded.push(entity);
    return entity;
  }

  RemoveEntity(entity: Entity) {
    this._entitiesToBeRemoved.push(entity);
  }

  AddComponent(entity: Entity, component: Component) {
    const id = entity.id;
    if (!this._componentPools.get(component.constructor)) {
      this._componentPools.set(component.constructor, new Map());
    }
    const componentPool = this._componentPools.get(component.constructor);
    if (componentPool) {
      componentPool.set(id, component);
    }

    if (!this._entities.get(id)) {
      throw new Error('Entity is unknown');
    }
    this._entities.get(id)?.add(component.constructor);

    for (const [_, system] of this._systems) {
      const entityComponents = this._entities.get(entity.id) as Set<ComponentType>;
      const hasAll = system.componentsRequired.difference(entityComponents).size === 0;
      if (hasAll) {
        system.entities.add(entity);
      }
    }
  }

  GetComponent<TComponent extends Component>(entity: Entity, componentClass: ComponentClass<TComponent>): TComponent | undefined {
    const componentPool = this._componentPools.get(componentClass);
    return componentPool
      ? componentPool.get(entity.id) as TComponent
      : undefined;
  }

  RemoveComponent<TComponent extends Component>(entity: Entity, componentClass: ComponentClass<TComponent>): void {
    this._componentPools.get(componentClass)?.delete(entity.id);
    for (const [_, system] of this._systems) {
      if (system.entities.has(entity)) {
        system.OnRemoveEntity?.(entity);
        system.entities.delete(entity);
      }
    }
  }

  Update() {
    for (const entity of this._entitiesToBeAdded) {
      for (const [_, system] of this._systems) {
        const entityComponents = this._entities.get(entity.id) as Set<ComponentType>;
        const hasAll = system.componentsRequired.difference(entityComponents).size === 0;
        if (hasAll) {
          system.entities.add(entity);
        }
      }
    }
    this._entitiesToBeAdded = [];

    for (const entity of this._entitiesToBeRemoved) {
      const id = entity.id;
      this._componentPools.forEach((pool) => {
        if (pool.has(id)) pool.delete(id);
      })
      this._freeIds.push(id);

      for (const [_, system] of this._systems) {
        const entityComponents = this._entities.get(entity.id) as Set<ComponentType>;
        const hasAll = system.componentsRequired.difference(entityComponents).size === 0;
        if (hasAll) {
          system.OnRemoveEntity?.(entity);
          system.entities.delete(entity);
        }
      }
    }
    this._entitiesToBeRemoved = [];

    for (const [_, system] of this._systems) {
      system.Update?.();
    }
  }
}