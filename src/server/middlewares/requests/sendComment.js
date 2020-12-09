const sendComment = async (req, res) => {
  const { queryPg } = require('./../../services/pg');
  const moment = require('moment');
  const comment = req.body;
  const login = req.cookies.login || 'unknown';
  const q = `
    INSERT INTO userdata.ndm_comment (comment, login, updated_at, doc_hash)
    VALUES ('${comment.text}', '${login}', '${moment().format()}', ${comment.id})
    ON CONFLICT (doc_hash) DO UPDATE SET
    comment = '${comment.text}', login = '${login}', updated_at = '${moment().format()}'
  `;

  await queryPg(res, q);

  res.send({status: 'OK'});
}

module.exports = sendComment;
