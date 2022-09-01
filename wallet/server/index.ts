const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const server = express();
server.use(bodyParser.json({ limit: '5mb' }));

server.post('/store', function (req, res) {
  const certificate: string = req.body.certificate;

  if (!certificate) {
    console.error('no certificate set to store');
    return;
  }

  let certificateData;
  if (typeof certificate === 'string') {
    certificateData = JSON.parse(certificate);
  } else if (typeof certificate === 'object') {
    certificateData = certificate;
  }

  const fileName = certificateData.id;
  console.log('storing certificate', fileName);
  fs.writeFileSync(`./storage/${fileName}.json`, certificate);
});

const port = 4555;
server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
