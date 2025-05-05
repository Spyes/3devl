import Component from "../component";
import Entity from "../entity";

export default class InputComponent extends Component {
  constructor(
    public GetKeyState: (keyState: Record<string, boolean>, entity: Entity) => void,
  ) { super(); }
}