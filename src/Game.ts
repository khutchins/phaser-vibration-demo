import { VDMainScene } from "./VDMainScene";
import { KHInputScene } from "./KH/Input/KHInputScene";

// This scene guarantees that KHInputScene's create is called before 
// DZDMainScene's.
class MultiSceneStarter extends Phaser.Scene {
    constructor() {
        super("MultiSceneStarter");
    }

    preload() {
        this.scene.run("KHInputScene");
    }

    create() {
        this.scene.start("VDMainScene");
    }
}

function makeGame(parentDiv: string): Phaser.Game {
    const config = {
        type: Phaser.AUTO,
        scale: {
            width: 600,
            height: 300,
            autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
        },
        input: {
            gamepad: true,
        },
        parent: parentDiv,
        scene: [ MultiSceneStarter, VDMainScene, KHInputScene ],
    };
    return new Phaser.Game(config);
}

module.exports = {
    makeGame: makeGame,
};