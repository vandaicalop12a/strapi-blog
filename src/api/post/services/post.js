"use strict";

/**
 * post service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::post.post", ({ strapi }) => ({
  findOne(slug, params = {}) {
    const { uid } = this.contentType;
    return strapi.db.query(uid).findOne({ where: { slug }, ...params });
  },
}));
