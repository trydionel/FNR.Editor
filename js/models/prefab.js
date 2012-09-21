define(function(require) {

  // Sourced from http://www.ro.me/tech/cel-shader
  //
	var fragmentShader = require('text!shaders/cel.frag');
	var vertexShader   = require('text!shaders/cel.vert');

  function Prefab() { Backbone.Model.apply(this, arguments) };
  return Backbone.Model.extend({
    constructor: Prefab,

    defaults: {
      size: 100,
      wireframe: false,
      category: 'Tile'
    },

    initialize: function() {
      var color     = this.get('color'),
          wireframe = this.get('wireframe'),
          factory   = this.get('factory') || function(model) {
            var size = model.get('size');
            return new THREE.CubeGeometry(size, size, size);
          };

      var geometry = factory(this);
      var material = new THREE.ShaderMaterial({
				uniforms: {
					"uDirLightPos":       { type:"v3", value: new THREE.Vector3() },
					"uDirLightColor":     { type:"c",  value: new THREE.Color(0xeeeeee) },
					"uAmbientLightColor": { type:"c",  value: new THREE.Color(0x050505) },
					"uBaseColor":         { type:"c",  value: new THREE.Color(color) }
				},
				vertexShader: vertexShader,
				fragmentShader: fragmentShader
			});

      this.set({ geometry: geometry, material: material }, { silent: true });
    }
  });
});
