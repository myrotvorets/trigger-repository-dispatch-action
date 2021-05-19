import { getInput, setFailed } from '@actions/core';
import { context, getOctokit } from '@actions/github';
import type { RequestError } from '@octokit/request-error';

function run(): void {
    try {
        const inputs = {
            token: getInput('token', { required: true }),
            repo: getInput('repo'),
            type: getInput('type', { required: true }),
            payload: getInput('payload'),
        };

        let owner: string;
        let repo: string;
        if (inputs.repo) {
            [owner, repo] = inputs.repo.split('/', 2);
        } else {
            ({ owner, repo } = context.repo);
        }

        const octokit = getOctokit(inputs.token);
        octokit.rest.repos
            .createDispatchEvent({
                owner,
                repo,
                event_type: inputs.type,
                client_payload: inputs.payload ? (JSON.parse(inputs.payload) as Record<string, unknown>) : undefined,
            })
            .catch((e: RequestError) => {
                if (e.status === 404) {
                    setFailed(
                        `${e.message}\n` +
                            `Possible reason: the repository ${owner}/${repo} not found, or the token has insufficient permissions`,
                    );
                } else {
                    setFailed(e.message);
                }
            });
    } catch (error) {
        setFailed((error as Error).message);
    }
}

run();
