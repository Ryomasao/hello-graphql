const fetch = require("node-fetch");

const requestGithubToken = async (credential) => {
  const URL_GET_GITHUB_TOKEN = "https://github.com/login/oauth/access_token";

  const response = await fetch(URL_GET_GITHUB_TOKEN, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(credential),
  }).catch((e) => {
    throw new Error(e);
  });

  return response.json();
};

const requestGithubUserAccount = async (token) => {
  const URL_GET_GITHUB_ACCOUNT = "https://api.github.com/user";
  const response = await fetch(URL_GET_GITHUB_ACCOUNT, {
    headers: {
      Authorization: `token ${token}`,
    },
  }).catch((e) => {
    throw new Error(e);
  });
  return response.json();
};

const authorizeWithGithub = async (credentials) => {
  const { access_token } = await requestGithubToken(credentials);
  const githubUser = await requestGithubUserAccount(access_token);
  return { ...githubUser, access_token };
};

const getFakeUsers = async (count) => {
  const URL = `https://randomuser.me/api/?results=${count}`;
  const response = await fetch(URL);
  const body = await response.json();
  const users = body.results.map((r) => ({
    githubLogin: r.login.username,
    name: `${r.name.first} ${r.name.last}`,
    avatar: r.picture.thumbnail,
    githubToken: r.login.sha1,
  }));
  return users;
};

const uploadStream = (stream, path) =>
  new Promise((resolve, reject) => {
    
  });

module.exports = { authorizeWithGithub, getFakeUsers, uploadStream };
