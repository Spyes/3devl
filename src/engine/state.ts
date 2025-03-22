import { GameState } from "./engine.types";

export const State: GameState = {
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