import InputComponent from "../components/InputComponent";
import Entity from "../entity";
import Registry from "../registry";
import System from "../system";

export default class InputSystem extends System {
  public componentsRequired = new Set<Function>([InputComponent]);
  public entities = new Set<Entity>();

  private _keyboardState: Record<string, boolean> = {};
  private _previousState: Record<string, boolean> = {};

  constructor(registry: Registry) {
    super(registry);
    document.addEventListener('keydown', this.OnKeyDown.bind(this), false);
    document.addEventListener('keyup', this.OnKeyUp.bind(this), false);
  }

  public Update(): void {
    const keys: Record<string, boolean> = { ...this._keyboardState };
    for (const keycode in this._keyboardState) {
      if (this._previousState[keycode] !== this._keyboardState[keycode]) {
        this._previousState[keycode] = this._keyboardState[keycode];
        keys[keycode] = this._keyboardState[keycode];
      }
    }

    for (const entity of this.entities) {
      const inputComponent = entity.GetComponent(InputComponent);
      if (!inputComponent) continue;
      inputComponent.GetKeyState(keys, entity);
    }
  }

  OnKeyDown(ev: KeyboardEvent) {
    if (!this._keyboardState[ev.key]) {
      this._keyboardState[ev.key] = true;
    }
  }

  OnKeyUp(ev: KeyboardEvent) {
    if (this._keyboardState[ev.key]) {
      this._keyboardState[ev.key] = false;
    }
  }
}