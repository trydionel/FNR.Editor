require.config({
  paths: {
    text: 'lib/text'
  }
});

require(['application', 'collections/prefabs'], function(Application, Prefabs) {

  var prefabs = new Prefabs([
    { id: 'Shrub', color: 0x00ff00 },
    { id: 'Dirt',  color: 0xffa54f, layer: -1 },
    { id: 'Water', color: 0x82cffd, layer: -1 }
  ]);

  var app = new Application({ prefabs: prefabs });
  app.run();

  window.Application = app;

});
