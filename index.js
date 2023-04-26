const input = require('./input.json');
const s3ParseUrl = require('s3-url-parser');
const AWS = require('aws-sdk');
const fs = require('fs');
const s3 = new AWS.S3({ region: 'eu-west-1' });
const mkdirp = require('mkdirp');
const filePath = `./downloads`;

async function getObject(bucketName, path) {
  return new Promise((resolve, reject) => {
    s3.getObject(
      {
        Bucket: bucketName,
        Key: path
      },
      (err, data) => {
        if (err) {
          reject(Buffer.from('Not Found'));
        } else {
          resolve(data.Body);
        }
      }
    );
  });
}

async function writeContent(doc) {
  try {
    if (doc.location) {
      const { bucket, key } = s3ParseUrl(doc.location);
      const obj = await getObject(bucket, key);
      await fs.writeFileSync(`${filePath}/${doc._id}.pdf`, obj);
    }
  } catch (err) {
    console.log(`${doc._id}, ${doc.location}, ${err}`);
  }
}

async function main() {
  input.forEach(async (doc) => {
    await writeContent(doc);
  });
}

main();
