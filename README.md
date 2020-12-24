# Trigger repository_dispatch Action

Triggers a [`repository_dispatch`](https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#create-a-repository-dispatch-event) event for the given repository.

## Inputs

| Name      | Default             | Required? | Description |
| --------- | ------------------- | --------- | ----------- |
| `token`   |                     | **YES**   | A [Personal Access Token](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token) with `repo` scope |
| `repo`    | `github.repository` | No        | The name of the repository to send the event (`owner/repo`) |
| `type`    |                     | **YES**   | A custom webhook event name |
| `payload` |                     | No        | JSON payload with extra information about the webhook event that your action or worklow may use. GitHub API allows for a maximum of 10 top-level properties |

## Example usage

In the workflow that needs to trigger a `repository_dispatch` action:

```yaml
      - name: Repository Dispatch
        uses: myrotvorets/trigger-repository-dispatch-action@1.0.0
        with:
          token: ${{ secrets.REPOSITORY_ACCESS_TOKEN }}
          repo: username/my-repo
          type: my-custom-event
          payload: '{ "ref": "${{ github.ref }}", "sha": "${{ github.sha }}" }'
```

A workflow that handles `repository_dispatch` action:

```yaml
name: Repository Dispatch
on:
  repository_dispatch:
    types:
      - my-custom-event
jobs:
  handle-dispatch:
    runs-on: ubuntu-latest
    steps:
      - name: Print commit hash
        run: echo ${{ github.event.client_payload.sha }}

      - name: Checkout
        uses: actions/checkout@v2
        with:
          ref: ${{ github.event.client_payload.ref }}
```
