export type GameState = {
  objects: GameObject[]
  scenes: GameScene[]
}

export type GameObject = {
  name: string
  type: string
}

export type GameScene = {
  name: string
  objects: GameObject[]
  instances: GameInstance[]
}

export type GameInstance = {
  name: string
  uuid: string
  position: {
    x: number
    y: number
    z: number
  }
}