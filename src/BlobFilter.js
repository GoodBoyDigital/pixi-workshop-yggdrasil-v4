
import * as PIXI from 'pixi.js'

export default class BlobFilter extends PIXI.Filter
{
	constructor()
	{
		super(`

			attribute vec2 aVertexPosition;
			attribute vec2 aTextureCoord;

			uniform mat3 projectionMatrix;

			varying vec2 vTextureCoord;

			void main(void)
			{
				gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
				vTextureCoord = aTextureCoord;
			}

		`, `

			varying vec2 vTextureCoord;

			uniform sampler2D uSampler;

			void main(){

				float alphaStrength = texture2D(uSampler, vTextureCoord).a;
				float alpha = 0.;

				if(alphaStrength > 0.5)
				{
					alpha = 1.;
				}
				else
				{
					alpha = 0.;
				}

				gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0) * alpha;
			}


		`)
	}
}