import { produce } from "immer";
import { GameObject, GameState } from "./engine.types"

let state: GameState = {
  objects: [
    {
      name: 'Platformer_Character',
      type: 'box',
    },
  ],
  scenes: [
    {
      name: 'Game_Scene',
      objects: [
        {
          name: 'Coins',
          type: 'sphere',
        }
      ],
      instances: [
        {
          name: 'Platformer_Character',
          uuid: '1',
          position: {
            x: 1,
            y: 1,
            z: 0,
          },
        },
        {
          name: 'Coins',
          uuid: '2',
          position: {
            x: -1,
            y: -1,
            z: 0,
          },
        }
      ]
    },
  ]
}

export default {
  get(): GameState {
    return state;
  },
  addGlobalObject(object: GameObject): GameState {
    state = produce(state, draft => {
      draft.objects.push(object)
    })
    return state
  },
  addSceneObject(scene: number, object: GameObject): GameState {
    state = produce(state, draft => {
      draft.scenes[scene].objects.push(object)
    })
    return state
  }
}