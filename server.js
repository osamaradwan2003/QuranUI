/*jshint esversion:6 */

let static_server = require("static-server");

let port = 8080;

let server = new static_server({
    rootPath: "./dist/",
    port: port
});

server.start(function () {
    console.log("Server Started At Port:" + port);
});