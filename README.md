# Slack File Upload Action

This GitHub Action allows you to upload files to a Slack channel using a Slack bot. It leverages the Slack Web API to handle file uploads and can be easily integrated into any GitHub Actions workflow.

## Features

- Upload files from your repository or workflow to a specified Slack channel.
- Use Slack bot tokens to authenticate the upload.
- Supports setting file titles and sharing file URLs in the Slack channel.

## Usage

### Basic Example

```yaml
name: Slack File Upload

on:
  push:
    branches:
      - main

jobs:
  upload-file:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository content
        uses: actions/checkout@v3

      - name: Upload file to Slack
        uses: aabed/slack-file-upload-action@v1.0.0
        with:
          slack_token: ${{ secrets.SLACK_TOKEN }}
          file_path: './file.txt'
          channel_id: 'C0123456789'
          initial_comment: 'Here is the file!'

```

### Inputs

| Input        | Description                                     | Required | Default |
|--------------|-------------------------------------------------|----------|---------|
| `slack_token`| The Slack bot token (`xoxb-...`).               | `true`   |         |
| `file_path`  | Path to the file you want to upload.            | `true`   |          |
| `channel_id` | The ID of the Slack channel where the file is uploaded. | `true`    | |
| `initial_comment` | An optional comment to include with the file upload. | `false` | |

### Outputs

| Output     | Description                         |
|------------|-------------------------------------|
| `file_url` | The public URL of the uploaded file.|


### Setup Slack Bot Token

To use this action, you will need a Slack bot token:

1. Go to your [Slack API](https://api.slack.com/) dashboard.
2. Create a new Slack App and enable the `files:write` and `files:read` permissions.
3. Install the app to your workspace and generate the bot token (`xoxb-...`).
4. Add the token to your GitHub repository's secrets under `Settings > Secrets and variables > Actions` as `SLACK_TOKEN`.

