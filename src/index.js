const core = require('@actions/core');
const { WebClient } = require('@slack/web-api');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const mime = require('mime-types');

async function run() {
  try {
    const SLACK_TOKEN = core.getInput('slack_token');
    const FILE_PATH = core.getInput('file_path');
    const CHANNEL_ID = core.getInput('channel_id');
    const INITIAL_COMMENT = core.getInput('initial_comment') || '';
    console.log(SLACK_TOKEN,FILE_PATH,CHANNEL_ID)

    const client = new WebClient(SLACK_TOKEN);
    const fileName = path.basename(FILE_PATH);
    const fileSize = fs.statSync(FILE_PATH).size;

    console.log(`Uploading file: ${fileName} (${fileSize} bytes) to channel: ${CHANNEL_ID}`);

    const upload_result = await client.files.getUploadURLExternal({
        filename: fileName,
        length: fileSize
    });

    const uploadUrl= upload_result.upload_url
    const fileId= upload_result.file_id 



    // Step 2: Upload the file
    const fileStream = fs.createReadStream(FILE_PATH);
    const mimeType = mime.lookup(FILE_PATH) || 'application/octet-stream';

    await axios.post(uploadUrl, fileStream, {
      headers: {
        'Content-Type': mimeType,
      },
    });

    // Step 3: Complete the upload
    const result = await client.files.completeUploadExternal({
      channel_id: CHANNEL_ID,
      files: [{ id: fileId, title: fileName }],
      initial_comment: INITIAL_COMMENT,
    });

    if (result.ok) {
        const fileInfo = await client.files.info({ file: fileId });
        if (fileInfo.ok) {
            console.log('File URL:', fileInfo.file.url_private);
        } else {
            throw new Error(`Error retrieving file info: ${JSON.stringify(fileInfo)}`);
        }
    } else {
      throw new Error('Failed to complete file upload.');
    }
  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
