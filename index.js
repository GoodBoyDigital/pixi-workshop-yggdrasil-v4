import * as PIXI from 'pixi.js';

const app = new PIXI.Application(window.innerWidth,
    window.innerHeight,
    { backgroundColor: 0xFF6600 });

document.body.style.margin = 0;
document.body.appendChild(app.view);

window.onResize = () =>
{
    app.resize(window.innerWidth, window.innerHeight);
};
