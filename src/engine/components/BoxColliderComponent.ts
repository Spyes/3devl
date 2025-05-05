import Component from "../component";
import Entity from "../entity";

export default class BoxColliderComponent extends Component {
  constructor(public onCollision: (entity: Entity) => void) { super(); }
}