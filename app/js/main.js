require.config({
  paths: {
    text: 'lib/text'
  }
});

require(['application', 'collections/prefabs'], function(Application, Prefabs) {

  var Sphere = function(model) {
    return new THREE.SphereGeometry(model.get('radius'));
  };

  var prefabs = new Prefabs([
    { id: 'Shrub', category: 'Tile', color: 0x00ff00 },
    { id: 'Dirt',  category: 'Tile', color: 0xffa54f },
    { id: 'Water', category: 'Tile', color: 0x82cffd },

    { id: 'Squirrel', category: 'Enemy', color: 0x333333, factory: Sphere, radius: 20 },
    { id: 'Fox', category: 'Enemy', color: 0xFF9900, factory: Sphere, radius: 30 },
  ]);

  var app = new Application({ prefabs: prefabs });
  app.run();

  window.Application = app;

});
