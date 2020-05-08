/* eslint-disable prettier/prettier */
"use strict";
const StaticFileHandler = require("serverless-aws-static-file-handler");
const express = require("express");
const path = require("path");
const app = express();

const clientFilesPath = path.join(__dirname, "./build/");
const fileHandler = new StaticFileHandler(clientFilesPath);
const serverless = require("serverless-http");
const router = express.Router();

app.get("/date", (req, res) => {
	res.json({
		date: new Date(),
	});
});
// app.use(app.router);
// app.use(function (req, res, next) {
// 	if (req.requestContext && req.requestContext.path === "/dev") {
// 		res.redirect("/dev/");
// 		return;
// 	}
// 	next();
// });
// app.use("/dev", express.static(path.join(__dirname, "build")));
app.get("/dev", (req, res, next) => {
	if (req.requestContext && req.requestContext.path === "/dev") {
		express.static(path.join(__dirname, "build"));
		res.redirect("/dev/");
		return;
	}
	next();
});
app.use((req, res, next) => {
	if (req.requestContext && req.requestContext.path === "/dev") {
		res.redirect("/dev/");
		express.static(path.join(__dirname, "build"));
		return;
	}
	next();
});

module.exports.handler = async (event, context) => {
	express.static(path.join(__dirname, "build"));
	serverless(app);
	event.path = "index.html";
	return fileHandler.get(event, context);
};
