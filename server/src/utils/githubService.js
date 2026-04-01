import axios from "axios";

export const fetchGithubCommitTotal = async () => {
  const username = process.env.GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;

  if (!username || !token) {
    throw new Error("Missing GITHUB_USERNAME or GITHUB_TOKEN in .env");
  }

  const startYear = 2020;
  const currentYear = new Date().getUTCFullYear();
  const now = new Date().toISOString();

  let totalCommits = 0;

  for (let year = startYear; year <= currentYear; year++) {
    const from =
      year === startYear ? "2020-01-01T00:00:00Z" : `${year}-01-01T00:00:00Z`;

    const to = year === currentYear ? now : `${year}-12-31T23:59:59Z`;

    const query = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            totalCommitContributions
          }
        }
      }
    `;

    const response = await axios.post(
      "https://api.github.com/graphql",
      {
        query,
        variables: { username, from, to },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const yearlyCount =
      response?.data?.data?.user?.contributionsCollection
        ?.totalCommitContributions || 0;

    totalCommits += yearlyCount;
  }

  return totalCommits;
};
