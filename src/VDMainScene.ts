import { KHInputKey } from "./KH/Input/KHInputKey";
import { KHInputKeyOr } from "./KH/Input/KHInputKeyOr";
import { KHInputProvider } from "./KH/Input/KHInputProvider";
import { KHPadAxis, KHPadInput } from "./KH/Input/KHInputProviderController";
import { KHMouseInput } from "./KH/Input/KHInputProviderMouse";
import { KHInputScene } from "./KH/Input/KHInputScene";
import { KHInputSet } from "./KH/Input/KHInputSet";

export class VDMainScene extends Phaser.Scene {

    inputSet: KHInputSet;
    lastInputText: Phaser.GameObjects.Text;
    vibeText: Phaser.GameObjects.Text;

    vibrateUntil: number = 0;

    vibrateKey: KHInputKey;

    constructor() {
        super("VDMainScene");
    }

    create() {
        this.events.on("shutdown", () => {
            this.inputSet?.unregister();
        })

        this.inputSet = new KHInputSet("main-set");
        this.inputSet.registerWith(KHInputScene.SharedInput);

        let vibrateKeys = [];
        for (let i = 0; i < KHInputScene.SharedInput.controllerProviders.length; i++) {
            vibrateKeys.push(KHInputScene.SharedInput.controllerProviders[i].getInput(KHPadInput.A));
        }
        vibrateKeys.push(KHInputScene.SharedInput.mouseProvider.getInput(KHMouseInput.Left));
        vibrateKeys.push(KHInputScene.SharedInput.keyboardProvider.getInput(Phaser.Input.Keyboard.KeyCodes.ENTER));

        this.vibrateKey = new KHInputKeyOr(this.inputSet, vibrateKeys, false);

        this.add.text(30, 10, 'Press Keyboard Enter, Gamepad Bottom Face, or Mouse LMB\nto try to vibrate.', { color: '#00bb00', align: 'center' });
        this.lastInputText = this.add.text(15, 50, 'Last Input Source: N/A', { color: '#ffff00', align: 'center' });
        this.vibeText = this.add.text(80, 150, 'Trying to vibrate!', { color: '#ff0000', fontSize: 40 } as any);
    }

    update(now: number, delta: number) {

        this.setLastInputText(KHInputProvider.lastInputSource ? KHInputProvider.lastInputSource.getId() : "None");

        this.vibeText.setVisible(now < this.vibrateUntil);

        if (this.vibrateKey.isJustDown()) {
            const vibeLength = 500;
            this.vibrateUntil = now + vibeLength;
            KHInputProvider.lastInputSource.tryVibrate(vibeLength, 0.5, 0.5);
        }
    }

    setLastInputText(providerId: string) {
        const maxLen = 40;
        providerId = providerId.length > maxLen ? providerId.substring(0, maxLen - 3) + "..." : providerId;
        this.lastInputText.setText(`Last Input Source: ${providerId}`);
    }
}