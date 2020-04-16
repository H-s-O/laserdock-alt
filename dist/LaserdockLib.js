"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const Struct = require("ref-struct");
const ArrayType = require("ref-array");
const ffi = require("ffi");
const LaserdockPoint = Struct({
    rg: 'uint16',
    b: 'uint16',
    x: 'uint16',
    y: 'uint16'
});
const LaserdockPointArray = ArrayType(LaserdockPoint);
// Windows 32-bit is not supported currently
const libPath = path
    .join(__dirname, '../sdk/liblaserdocklib')
    // Super super dirty hack to make this work with Electron; native dependencies
    // dont'get placed inside the "app.asar" bundle, but instead get placed in a separate directory called "app.asar.unpacked"
    .replace('app.asar', 'app.asar.unpacked');
const LaserdockLib = ffi.Library(libPath, {
    nodeInit: ['int', []],
    nodeEnableOutput: ['int', []],
    nodeDisableOutput: ['int', []],
    nodeSetDacRate: ['int', ['uint32']],
    nodeClearRingbuffer: ['int', []],
    nodeSendSamples: ['int', [LaserdockPointArray, 'uint32']]
});
function init() {
    return LaserdockLib.nodeInit();
}
exports.init = init;
function enableOutput() {
    return LaserdockLib.nodeEnableOutput();
}
exports.enableOutput = enableOutput;
function disableOutput() {
    return LaserdockLib.nodeDisableOutput();
}
exports.disableOutput = disableOutput;
function clearRingBuffer() {
    return LaserdockLib.nodeClearRingbuffer();
}
exports.clearRingBuffer = clearRingBuffer;
function setDacRate(rate) {
    return LaserdockLib.nodeSetDacRate(rate);
}
exports.setDacRate = setDacRate;
function sendSamples(points, numOfPoints) {
    return LaserdockLib.nodeSendSamples(points, numOfPoints);
}
exports.sendSamples = sendSamples;
