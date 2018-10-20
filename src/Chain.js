
import * as PIXI from 'pixi.js'
import VerletChain from './VerletChain'

export default class Chain extends PIXI.Rope {

	constructor(size)
	{
		var texture = PIXI.Texture.from('./assets/hoover_ray.png');

		var verlet = new VerletChain();
		verlet.build(size);

		super(texture, verlet.links);

		this.verlet = verlet;

		this.tick = 0;
	}

	updateTransform()
	{
		super.updateTransform();

		this.verlet.update();
	}
}