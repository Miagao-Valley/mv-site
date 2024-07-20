import { Octokit } from "octokit";

export { topLanguages };

const octokit = new Octokit({
    auth: await (import.meta.env.GITHUB_API_KEY),
});

const org = 'Miagao-Valley';

// const members = await octokit.request("GET /orgs/{org}/members", {
// 	org: org,
// 	headers: {
// 		"X-GitHub-Api-Version": "2022-11-28",
// 	},
// });

// console.log(members.data.length);

async function fetchRepos(org) {
    const result = await octokit.paginate('GET /orgs/{org}/repos', {
        org: org,
        type: 'public',
        per_page: 100,
        headers: {
            "X-GitHub-Api-Version": "2022-11-28",
        },
    });

    return result;
}

async function fetchLanguages(org) {
    const repos = await fetchRepos(org);

    const langPromises = repos.map(repo =>
        octokit.request('GET /repos/{owner}/{repo}/languages', {
            owner: org,
            repo: repo.name,
        })
    );

    const langResults = await Promise.all(langPromises);
    const langs = langResults.flatMap(result => result.data);
    return langs;
}

async function getTopLangauges(org) {
    const langauges = await fetchLanguages(org);
    const topLanguages = {};

    langauges.forEach(language => {
        for (const [key, value] of Object.entries(language)) {
            if (key in Object.keys(topLanguages)) {
                topLanguages[key] += value;
            } else {
                topLanguages[key] = value;
            }
        }
    });

    return topLanguages;
}

export const topLanguages = await getTopLangauges(org);

