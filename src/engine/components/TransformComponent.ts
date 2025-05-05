import { Vector3 } from "three";
import Component from "../component";

export default class TransformComponent extends Component {
  constructor(
    public position: Vector3,
    public scale: Vector3,
    public rotation: number
  ) { super(); }
}