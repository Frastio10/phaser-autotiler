import { Boot } from "./scenes/Boot";
import { GameOver } from "./scenes/GameOver";
import { Game as MainGame } from "./scenes/Game";
import { AUTO, Game } from "phaser";
import { Preloader } from "./scenes/Preloader";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,

    mode: Phaser.Scale.FIT,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: "game-container",
    // backgroundColor: "#028af8",
    scene: [Boot, Preloader, MainGame, GameOver],
    dom: {
        createContainer: true,
    },
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
