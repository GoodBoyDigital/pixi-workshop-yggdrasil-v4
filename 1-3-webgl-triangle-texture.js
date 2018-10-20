
/*============== Creating a canvas ====================*/
var canvas = document.createElement('canvas');
var gl = canvas.getContext('experimental-webgl');


document.body.appendChild(canvas);

canvas.width = 500;
canvas.height = 500;

/*======== Defining and storing the geometry ===========*/

var vertices = [
    -0.5,0.5,
    -0.5,-0.5,
    0.5,-0.5,
];

var colors = [
    1,0,0,
    0,1,0,
    0,0,1,
];

var uvs = [
    0,0,
    0,1,
    1,1,
];


var indices = [0,1,2];

// Create an empty buffer object to store vertex buffer
var vertex_buffer = gl.createBuffer();

// Bind appropriate array buffer to it
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

// Pass the vertex data to the buffer
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

////////////////

// Create an empty buffer object to store vertex buffer
var vertex_color_buffer = gl.createBuffer();

// Bind appropriate array buffer to it
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_color_buffer);

// Pass the vertex data to the buffer
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

////////////////

// Create an empty buffer object to store vertex buffer
var vertex_uv_buffer = gl.createBuffer();

// Bind appropriate array buffer to it
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_uv_buffer);

// Pass the vertex data to the buffer
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);



// Unbind the buffer
gl.bindBuffer(gl.ARRAY_BUFFER, null);

// Create an empty buffer object to store Index buffer
var Index_Buffer = gl.createBuffer();

// Bind appropriate array buffer to it
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

// Pass the vertex data to the buffer
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

// Unbind the buffer
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

/*================ Shaders ====================*/

// Vertex shader source code
var vertCode =`
precision highp float;

attribute vec2 coordinates;
attribute vec3 colors;
attribute vec2 uvs;

varying vec3 vColor;
varying vec2 vUvs;

void main(void) {

    vColor = colors;
    vUvs = uvs;
    gl_Position = vec4(coordinates, 0.0, 1.0);

}
`;

// Create a vertex shader object
var vertShader = gl.createShader(gl.VERTEX_SHADER);

// Attach vertex shader source code
gl.shaderSource(vertShader, vertCode);

// Compile the vertex shader
gl.compileShader(vertShader);

//fragment shader source code
var fragCode =`
precision highp float;

uniform sampler2D texture;
varying vec3 vColor;
varying vec2 vUvs;

void main(void) {

    vec4 t = texture2D(texture, vUvs);
    gl_FragColor = t;//vec4(vColor, 1.);
}
`;

// Create fragment shader object
var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

// Attach fragment shader source code
gl.shaderSource(fragShader, fragCode);

// Compile the fragmentt shader
gl.compileShader(fragShader);

// Create a shader program object to store
// the combined shader program
var shaderProgram = gl.createProgram();

// Attach a vertex shader
gl.attachShader(shaderProgram, vertShader);

// Attach a fragment shader
gl.attachShader(shaderProgram, fragShader);

// Link both the programs
gl.linkProgram(shaderProgram);

if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
{
    console.error('Pixi.js Error: Could not initialize shader.');
    console.error('gl.VALIDATE_STATUS', gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS));
    console.error('gl.getError()', gl.getError());

    // if there is a program info log, log it
    if (gl.getProgramInfoLog(shaderProgram) !== '')
    {
        console.warn('Pixi.js Warning: gl.getProgramInfoLog()', gl.getProgramInfoLog(shaderProgram));
    }


}


// Use the combined shader program object
gl.useProgram(shaderProgram);

/*======= Associating shaders to buffer objects =======*/

// Bind vertex buffer object
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

// Bind index buffer object
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

// Get the attribute location
var coord = gl.getAttribLocation(shaderProgram, "coordinates");

// Point an attribute to the currently bound VBO
gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

// Enable the attribute
gl.enableVertexAttribArray(coord);


//////////////////////////////////

// Bind vertex buffer object
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_color_buffer);

// Get the attribute location
var colorsAttrib = gl.getAttribLocation(shaderProgram, "colors");

// Point an attribute to the currently bound VBO
gl.vertexAttribPointer(colorsAttrib, 3, gl.FLOAT, false, 0, 0);

// Enable the attribute
gl.enableVertexAttribArray(colorsAttrib);


//////////////////////////////////

// Bind vertex buffer object
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_uv_buffer);

// Get the attribute location
var uvsAttrib = gl.getAttribLocation(shaderProgram, "uvs");

// Point an attribute to the currently bound VBO
gl.vertexAttribPointer(uvsAttrib, 2, gl.FLOAT, true, 0, 0);

// Enable the attribute
gl.enableVertexAttribArray(uvsAttrib);



var image = new Image();
image.onload = ()=>{

    /*=========Drawing the triangle===========*/

    gl.activeTexture( gl.TEXTURE0);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 1);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set the view port
    gl.viewport(0,0,canvas.width,canvas.height);

    // Draw the triangle
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);

}

image.src = 'assets/vac_suk_01.png';

