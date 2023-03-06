const _ = require("lodash");
const getInfoData = (object = {}, filter = []) => {
  return _.pick(object, filter);
};

module.exports = {
  getInfoData,
};
