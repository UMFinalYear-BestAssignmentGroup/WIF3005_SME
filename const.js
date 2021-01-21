
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.json')[env];

config.user = "lsgukmofvjwiov";
config.password = "90d7bbe12b5c1bbf68dae8f287e271baa0092fe1bb6dbef1065a8f0c8590bbfa";
config.database = "dad9g5pcqsr4rr";

module.exports = {
    CONST_page_limit: 10,
    dbPool: config
};