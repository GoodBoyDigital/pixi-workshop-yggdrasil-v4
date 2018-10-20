import * as PIXI from 'pixi.js';

export default class SpriteMaskFilter extends PIXI.Filter
{
    /**
     * @param {PIXI.Sprite} sprite - the target sprite
     */
    constructor(sprite)
    {
        const maskMatrix = new PIXI.Matrix();

        const vert = `
        attribute vec2 aVertexPosition;
        attribute vec2 aTextureCoord;

        uniform mat3 projectionMatrix;
        uniform mat3 otherMatrix;

        varying vec2 vMaskCoord;
        varying vec2 vTextureCoord;

        void main(void)
        {
            gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

            vTextureCoord = aTextureCoord;
            vMaskCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;
        }
        `;

        const frag = `
        varying vec2 vMaskCoord;
        varying vec2 vTextureCoord;

        uniform sampler2D uSampler;
        uniform sampler2D mask;
        uniform float alpha;
        uniform float offset;

        void main(void)
        {
            vec4 original = texture2D(uSampler, vTextureCoord);
            vec4 masky = texture2D(mask, vMaskCoord);

            if(masky.r * alpha >= offset)
            {
                original *= 0.;
            }
           
            gl_FragColor = original;
        }
        `;

        super(
            vert, frag
        );

        sprite.renderable = false;

        this.maskSprite = sprite;
        this.maskMatrix = maskMatrix;

        this.uniforms.offset = 1;
    }

    get offset()
    {
        return this.uniforms.offset;
    }

    set offset(value)
    {
        this.uniforms.offset = value;
    }

    apply(filterManager, input, output)
    {
        const maskSprite = this.maskSprite;
        const tex = this.maskSprite.texture;

        if (!tex.valid)
        {
            return;
        }
        if (!tex.transform)
        {
            // margin = 0.0, let it bleed a bit, shader code becomes easier
            // assuming that atlas textures were made with 1-pixel padding
            tex.transform = new PIXI.TextureMatrix(tex, 0.0);
        }
        tex.transform.update();

        this.uniforms.mask = tex;
        this.uniforms.otherMatrix = filterManager.calculateSpriteMatrix(this.maskMatrix, maskSprite)
            .prepend(tex.transform.mapCoord);
        this.uniforms.alpha = maskSprite.worldAlpha;

        filterManager.applyFilter(this, input, output);
    }
}
