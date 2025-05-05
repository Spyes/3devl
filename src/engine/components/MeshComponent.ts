import { BufferGeometry, Material, Mesh } from "three";
import Component from "../component";

export default class MeshComponent extends Component {
  constructor(
    public geometry: BufferGeometry,
    public material: Material,
    public mesh?: Mesh
  ) { super(); }
}