"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@laser-dac/core");
const laserdockLib = require("./LaserdockLib");
const convert_1 = require("./convert");
class Laserdock extends core_1.Device {
    async start() {
        this.stop();
        const status = laserdockLib.init();
        if (status < 1) {
            return false;
        }
        const output = laserdockLib.enableOutput();
        laserdockLib.clearRingBuffer();
        return !!output;
    }
    stop() {
        laserdockLib.disableOutput();
        if (this.interval) {
            clearTimeout(this.interval);
        }
    }
    convertPoint(p) {
        return {
            x: convert_1.relativeToPosition(p.x),
            y: convert_1.relativeToPosition(1 - p.y),
            rg: convert_1.relativeToRedGreen(p.r, p.g),
            b: convert_1.relativeToBlue(p.b)
        };
    }
    stream(scene, pointsRate, fps) {
        laserdockLib.setDacRate(pointsRate);
        const callback = () => {
            const len = scene.points.length;
            this.interval = setTimeout(callback, (len / pointsRate) * 1000);
            const points = scene.points.map(this.convertPoint);
            laserdockLib.sendSamples(points, len);
        };
        this.interval = setTimeout(callback, 0);
    }
}
exports.Laserdock = Laserdock;
