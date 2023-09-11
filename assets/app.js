/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import Page from './class/Page';
import './styles/app.scss';
  
document.addEventListener('DOMContentLoaded', async () => {

    const app = new Page({
      editorName: 'mcisme',
      editorSaver: 'mcisme-saver',
      editorTitle: 'mcisme-title',
      editorCreate: 'mcisme-create'
    });
    app.initEditor();
    window.app = app;
});

// var Turbolinks = require("turbolinks")
// Turbolinks.start()
