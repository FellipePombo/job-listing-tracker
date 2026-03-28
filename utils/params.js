const fs = require('fs');
const path = require('path');
const { PARAMS_SCHEMA } = require('../config/params');

const PARAMS_FILE = path.join(__dirname, '../config/runtimeParams.json');



function buildDefaults(schema = PARAMS_SCHEMA) {
  const result = {};

  for (const key in schema) {
    const field = schema[key];

    if (field.type === "range") {
      result[key] = {};
      for (const sub in field.fields) {
        result[key][sub] = field.fields[sub].default;
      }
    } else {
      result[key] = field.default;
    }
  }

  return result;
}



function validateParams(params, schema = PARAMS_SCHEMA) {
  for (const key in schema) {
    const field = schema[key];
    const value = params[key];

    if (field.type === "enum") {
      if (!field.values.includes(value)) {
        throw new Error(`Invalid ${key}: ${value}`);
      }
    }

    if (field.type === "string" && field.required && !value) {
      throw new Error(`${key} is required`);
    }

    if (field.type === "range") {
      if (value.min > value.max) {
        throw new Error(`${key}: min cannot be greater than max`);
      }
    }
  }
}



function loadParams() {
  if (!fs.existsSync(PARAMS_FILE)) {
    const defaults = buildDefaults();
    fs.writeFileSync(PARAMS_FILE, JSON.stringify(defaults, null, 2));
    return defaults;
  }

  return JSON.parse(fs.readFileSync(PARAMS_FILE));
}



function saveParams(params) {
  fs.writeFileSync(PARAMS_FILE, JSON.stringify(params, null, 2));
}



function updateParams(current, updates) {
  const merged = { ...current };

  for (const key in updates) {
    if (typeof updates[key] === "object" && !Array.isArray(updates[key])) {
      merged[key] = { ...merged[key], ...updates[key] };
    } else {
      merged[key] = updates[key];
    }
  }

  validateParams(merged);
  saveParams(merged);

  return merged;
}


module.exports = {
  buildDefaults,
  validateParams,
  loadParams,
  saveParams,
  updateParams
};
