const { app, Window } = require('lynxjs'); // Hypothetical LynxJS API

app.on('ready', () => {
  const mainWindow = new Window({
    width: 800,
    height: 600,
    title: 'Nearby Share App'
  });
  mainWindow.loadFile('src/ui/index.html');
});