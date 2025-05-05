import { BoxGeometry, MeshBasicMaterial, Vector3 } from "three";
import { Game } from "./game/game";
import TransformComponent from "./engine/components/TransformComponent";
import MeshComponent from "./engine/components/MeshComponent";
import InputComponent from "./engine/components/InputComponent";
import Entity from "./engine/entity";
import Time from "./engine/time";

enum ComponentTypes {
  TransformComponent = 'TransformComponent',
  MeshComponent = 'MeshComponent',
}

const gameJSON = {
  objects: [
    {
      guid: 'abc123',
      name: 'Cube',
      components: [
        {
          type: TransformComponent,
          values: [new Vector3(0, 0, -5), new Vector3, 0],
        },
        {
          type: MeshComponent,
          values: [new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: '#152627' })]
        },
        {
          type: InputComponent,
          values: [GetKeyState]
        }
      ],
    }
  ],
};

function GetKeyState(keyState: Record<string, boolean>, entity: Entity) {
  const transformComponent = entity.GetComponent(TransformComponent);
  if (!transformComponent) return;

  const velocity = new Vector3();

  if (keyState.w) {
    velocity.y = 1;
  } else if (keyState.s) {
    velocity.y = -1;
  }

  if (keyState.a) {
    velocity.x = -1;
  } else if (keyState.d) {
    velocity.x = 1;
  }

  if (keyState['`']) {
    const meshComponent = entity.GetComponent(MeshComponent);
    if (meshComponent) {
      meshComponent.material.setValues({ wireframe: !meshComponent.material.wireframe });
    }
  }

  velocity.normalize().multiplyScalar(Time.deltaTime)
  transformComponent.position.add(velocity);
}

(function () {
  const game = new Game();
  game.Initialize();
  game.LoadJSON(gameJSON);
})();