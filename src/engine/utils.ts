import { BoxGeometry, BufferGeometry, SphereGeometry } from "three"

export const getGeometryByType = (type: string): BufferGeometry =>{
  switch (type.toLowerCase()) {
    case 'box':
      return new BoxGeometry(0.2, 0.2, 0.2)
    case 'sphere':
      return new SphereGeometry(0.2, 32, 32)
    default:
      throw new Error(`Unknown geometry type: ${type}`)
  }
}