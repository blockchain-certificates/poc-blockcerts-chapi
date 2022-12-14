const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const server = express();
server.use(cors());
server.use(bodyParser.json({ limit: '5mb' }));

const STORAGE_DIRECTORY = `${__dirname}/storage`;

server.post('/store', function (req, res) {
  const certificate = req.body.certificate.data;

  if (!certificate) {
    console.error('no certificate set to store');
    return res.json({
      status: 500,
      statusText: 'No certificate to store'
    });
  }

  const fileName = certificate.id;
  console.log('storing certificate', fileName, 'to path', `${__dirname}/storage/`);
  fs.writeFileSync(`${STORAGE_DIRECTORY}/${fileName}.json`, JSON.stringify(certificate));
  return res.json({
    status: 200,
    statusText: `Successfully stored certificate with id ${fileName}`
  });
});

server.get('/get', function (req, res) {
  const fileName = req.query.id;
  console.log('looking up certificate with id', req.query.id);
  const data = fs.readFileSync(`${STORAGE_DIRECTORY}/${fileName}.json`, { encoding:'utf8' });
  if (data) {
    console.log('found certificate');
    return res.json({
      status: 200,
      certificate: data
    });
  } else {
    console.error('no certificate found');
    return res.json({
      status: 400
    });
  }
});

server.get('/list', function (req, res) {
  const files = fs.readdirSync(`${STORAGE_DIRECTORY}`);
  const fileList = [];
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(`${STORAGE_DIRECTORY}/${file}`, { encoding:'utf8' }));
    fileList.push({
      name: data.credentialSubject.claim.name,
      id: data.id,
      issuerName: data.issuer.name,
      issuanceDate: data.issuanceDate
    })
  }

  return res.json({
    status: 200,
    list: fileList
  });
});

const port = 4555;
server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
