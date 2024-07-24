import { Octokit } from "octokit";

export { languages, totalLangUsage, numMembers, numProjects, numStars };

const octokit = new Octokit({
    auth: import.meta.env.PUBLIC_GITHUB_API_KEY,
});

console.log(import.meta.env.PUBLIC_GITHUB_API_KEY);

const org = 'Miagao-Valley';

const alt = {
    languages: [
        { name: 'Astro', value: 42790 },
        { name: 'TypeScript', value: 9793 },
        { name: 'JavaScript', value: 7247 },
        { name: 'EJS', value: 4645 },
        { name: 'HTML', value: 1967 },
        { name: 'Java', value: 1824 },
        { name: 'CSS', value: 765 }
    ],
    numMembers: 6,
    numProjects: 5,
    numStars: 6,
}

async function fetchRepos(org) {
    const result = await octokit.request('GET /orgs/{org}/repos', {
        org: org,
        type: 'public',
        per_page: 100,
        headers: {
            "X-GitHub-Api-Version": "2022-11-28",
        },
    });

    if (result.status != 200) {
        return;
    }

    return result.data;

}

async function fetchLanguages(org) {
    const repos = await fetchRepos(org);

    if (!repos) {
        return;
    }

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

async function getLangauges(org) {
    const langauges = await fetchLanguages(org);

    if (!langauges) {
        return;
    }

    const languagesObj = {
    };

    // get cumulative values of each languages
    langauges.forEach(language => {
        for (const [key, value] of Object.entries(language)) {
            if (key in Object.keys(languagesObj)) {
                languagesObj[key] += value;
            } else {
                languagesObj[key] = value;
            }
        }
    });

    // turn into array
    const languagesArr = [];

    for (const [key, value] of Object.entries(languagesObj)) {
        let obj = {
            "name": key,
            "value": value
        };
        languagesArr.push(obj)
    }

    return languagesArr.sort((a, b) => (b.value - a.value));
}



async function getNumMembers(org) {
    const members = await octokit.request('GET /orgs/{org}/members', {
        org: org,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })

    if (members.status != 200) {
        return alt.numMembers;
    }

    const numMembers = members.data.length;
    
    if (numMembers == 0) {
        return alt.numMembers;

    }

    return numMembers;
}

async function getNumProjs(org) {
    const organization = await octokit.request('GET /orgs/{org}', {
        org: org,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });

    if (organization.status != 200) {
        return alt.numProjects - 1;
    }

    return (organization.data.public_repos - 1);

}

async function getStars(org) {
    const repos = await fetchRepos(org);

    if (!repos) {
        return alt.numStars;
    }

    let stars = 0;
    repos.map(result => stars += result.stargazers_count);

    return stars;
}

const numProjects = await getNumProjs(org);
const numStars = await getStars(org);
const numMembers = await getNumMembers(org);

const languages = await getLangauges(org) ?? alt.languages;
let totalLangUsage = 0;
languages.map((lang) => (totalLangUsage += lang.value));