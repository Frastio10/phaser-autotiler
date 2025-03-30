import Phaser from "phaser";
import { AutoTiler } from "../autotile";

export class Game extends Phaser.Scene {
    private map!: Phaser.Tilemaps.Tilemap;
    private layer!: Phaser.Tilemaps.TilemapLayer;
    private selectedTile: number = -1;

    constructor() {
        super("Game");
    }

    preload() {
        this.load.image("tiles", "/assets/snow-tileset.png"); // Load your tileset image
    }

    create() {
        const tileSize = 16;

        let tileData = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];

        this.map = this.make.tilemap({
            data: tileData,
            tileWidth: tileSize,
            tileHeight: tileSize,
        });

        const tileset = this.map.addTilesetImage(
            "tiles",
            undefined,
            tileSize,
            tileSize,
        );
        if (!tileset) return;

        this.layer = this.map.createLayer(0, tileset)!;
        this.layer.setScale(2);

        this.layer.setInteractive();

        let autoTiler = new AutoTiler(this.map);
        autoTiler.draw();

        const hoverOutline = this.add.graphics();
        const scaleFactor = 2;

        this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            const hoveredTilePos = this.map.worldToTileXY(
                pointer.worldX,
                pointer.worldY,
            );

            if (!hoveredTilePos) return;

            const { x, y } = hoveredTilePos;
            const worldPos = this.map.tileToWorldXY(x, y);

            if (!worldPos) return;

            // Clear previous outline
            hoverOutline.clear();

            // Draw new outline (black border)
            hoverOutline.lineStyle(3, 0xff9900, 1);
            hoverOutline.setVisible(true);
            hoverOutline.fillStyle(0xff9900, 1);
            hoverOutline.fill();
            hoverOutline.strokeRect(
                worldPos.x,
                worldPos.y,
                tileSize * scaleFactor,
                tileSize * scaleFactor,
            );

            hoverOutline.setDepth(999);
        });

        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            const currentSelectedTile = this.map.worldToTileXY(
                pointer.worldX,
                pointer.worldY,
            );

            if (!currentSelectedTile) return;
            const x = currentSelectedTile.x;
            const y = currentSelectedTile.y;

            if (tileData[y][x] !== this.selectedTile) {
                tileData[y][x] = this.selectedTile; // Update the data array

                // Redraw the tilemap using the modified tileData
                this.map.putTileAt(this.selectedTile, x, y);
                autoTiler.updateMap(this.map);
                // autoTiler.updateTile(x, y);
                autoTiler.draw();
            }
        });

        this.input.keyboard?.on("keydown-ONE", () => (this.selectedTile = 1));
        this.input.keyboard?.on("keydown-TWO", () => (this.selectedTile = 2));
    }
}
