"use strict";

const Hapi = require("@hapi/hapi");
const Joi = require("@hapi/joi");

const init = async () => {
  let stores = [
    {
      name: "myfirststore",
      items: [
        {
          name: "item_1",
          price: 100,
        },
      ],
    },
    {
      name: "myfirststore",
      items: [
        {
          name: "item_1",
          price: 100,
        },
      ],
    },
  ];
  const server = Hapi.server({
    port: 3010,
    host: "localhost",
  });

  //   get store
  server.route({
    method: "GET",
    path: "/store",
    handler: (request, h) => {
      return stores;
    },
  });

  //   add store
  server.route({
    method: "POST",
    path: "/store",
    options: {
      validate: {
        payload: {
          name: Joi.string().required(),
          items: Joi.array().items({
            name: Joi.string().required(),
            price: Joi.number().required(),
          }),
        },
      },
    },
    handler: (req, h) => {
      let store = req.payload;
      stores.push(store);
      return stores;
    },
  });

  //   # GET /store/<string:name></string>
  server.route({
    method: "GET",
    path: "/store/{name}",
    options: {
      validate: {
        params: {
          name: Joi.string().required(),
        },
      },
    },
    handler: (req, h) => {
      let store_name = req.params.name;
      let result = stores.find((o) => (o.name = store_name));
      return result;
    },
  });

  //   # POST /store/<string:name>/item
  server.route({
    method: "POST",
    path: "/store/{name}/item",
    options: {
      validate: {
        params: {
          name: Joi.string().required(),
        },
        payload: {
          name: Joi.string().required(),
          price: Joi.number().required(),
        },
      },
    },
    handler: (req, h) => {
      let item = req.payload;
      let store_name = req.params.name;
      let result = stores.find((o) => (o.name = store_name));
      let foundIdex = stores.indexOf(result);
      result.items.push(item);
      stores[foundIdex] = result;
      return stores;
    },
  });

  // # GET /store/<name>/item
  server.route({
    method: "GET",
    path: "/store/{name}/item",
    options: {
      validate: {
        params: {
          name: Joi.string().required(),
        },
      },
    },
    handler: (req, h) => {
      let store_name = req.params.name;
      let result = stores.find((o) => (o.name = store_name));
      return result.items;
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
