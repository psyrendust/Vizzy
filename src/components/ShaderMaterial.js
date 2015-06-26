import DynamicGeometry from 'famous/webgl-geometries/DynamicGeometry';
import Material from 'famous/webgl-materials/Material';

const REG_ATTRIBUTES = /^a_/i;
const REG_UNIFORMS = /^u_/i;
const REG_VARYINGS = /^v_/i;

let materialRegistry = {};

export default class ShaderMaterial {
  constructor(name = '', options = {}) {
    if (!materialRegistry[name]) {
      materialRegistry[name] = {};
      if (options.vertexBuffers) {
        let args
        for (let i = 0, len = options.vertexBuffers.length; i < len; i++) {
          args = options.vertexBuffers[i];
          options.geometry.setVertexBuffer(args[0], args[1], args[2]);
        }
      }
      Material.registerExpression(`${name}Vertex`, {
        defines: options.vertexShader[0],
        glsl: options.vertexShader[1],
        output: options.vertexShader[2]
      });
      Material.registerExpression(`${name}Fragment`, {
        glsl: options.fragmentShader[0],
        output: options.fragmentShader[1]
      });
      if (options.defaults) {
        let keys = Object.keys(options.defaults);
        let vertexOptions = { attributes: {}, uniforms: {}, varyings: {} };
        for (let i = 0, len = keys.length; i < len; i++) {
          if ( keys[i].match(REG_ATTRIBUTES) ) {
            vertexOptions.attributes[keys[i]] = options.defaults[keys[i]];
          } else if ( keys[i].match(REG_UNIFORMS) ) {
            vertexOptions.uniforms[keys[i]] = options.defaults[keys[i]];
          } else if ( keys[i].match(REG_VARYINGS) ) {
            vertexOptions.varyings[keys[i]] = options.defaults[keys[i]];
          }
        }
        materialRegistry[name].vertexShader = Material[`${name}Vertex`](null, vertexOptions);
        materialRegistry[name].fragmentShader = Material[`${name}Fragment`]();
        return materialRegistry[name];
      }
    }
  }
}

// this.geometry = new DynamicGeometry({ type: 'LINEAR' });
// this.geometry.fromGeometry(new Sphere({ detail: 100 }));
// this.shader = new ShaderMaterial('explode', {
//   geometry: this.geometry,
//   vertexShader: [require('../glsl/explode/vertexShader.glsl'), 'sunDisplacement();', 3],
//   fragmentShader: [require('../glsl/explode/fragmentShader.glsl'), 4],
//   defaults: {
//     a_Displacement: 1,
//     u_Amplitude: 1,
//     v_Displacement: 1
//   },
//   vertexBuffers: [
//     ['a_Displacement', displacement, 1]
//   ]
// });

// this.mesh.setGeometry(this.geometry);
// this.mesh.setPositionOffset(this.shader.vertexShader);
// this.mesh.setBaseColor(this.shader.fragmentShader);

// var shader = THREE.ShaderLib[ "cube" ];
// shader.uniforms[ "tCube" ].value = textureCube;

// var material = new THREE.ShaderMaterial( {

//   fragmentShader: shader.fragmentShader,
//   vertexShader: shader.vertexShader,
//   uniforms: shader.uniforms,
//   depthWrite: false,
//   side: THREE.BackSide

// } ),

// mesh = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), material );
