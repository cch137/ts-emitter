import Emitter from "./index.js";

const emitter = new Emitter<{ hi: [text: string, auth: number] }>();

emitter.on("hi", console.log);
emitter.emit("hi", "haha", 6);
