import {PROXY_URL, APPLICATION_ID} from '../keys.js';

const getRequestHeaders = (token) => new Headers({
  "Authorization": `Bearer ${token}`,
  "Client-Id": APPLICATION_ID,
});

export const twitchFetch = async (url, token) => {
  const res = await fetch(url, {headers: getRequestHeaders(token)});
  return res?.json() || {};
};

export const getUsers = async (sessionData, ids, usernames=[]) => {
  const getByIds = Boolean(ids?.length);

  const existingUsers = new Set();
  const newUserIds = new Set();
  const newUsernames = new Set();

  ids.forEach(id => {
    const user = sessionData.users[id];
    if(user) {
      existingUsers.add(user);
    } else {
      newUserIds.add(id);
    }
  });

  const usernameToIdMap = {};

  Object.entries(sessionData.users).forEach(([userId, user]) => {
    usernameToIdMap[user.display_name] = userId;
  });

  usernames.forEach(username => {
    const userId = usernameToIdMap[username];
    const user = sessionData.users[userId];
    if(user) {
      existingUsers.add(user);
    } else {
      newUsernames.add(username);
    }
  });

  const userIds = [...newUserIds].map(id => `id=${id}`).join('&');
  const userNames = [...newUsernames].map(username => `login=${username}`).join('&');

  const urls = [];

  userIds?.length && urls.push(`https://api.twitch.tv/helix/users?${userIds}`);
  userNames?.length && urls.push(`https://api.twitch.tv/helix/users?${userNames}`);

  const responses = await Promise.all(urls.map(
    url => twitchFetch(url, sessionData.streamer.token)
  ));
  const fetchedUsers = [];
  responses.forEach(res => {
    if(res?.data?.length) {
      res?.data.forEach(user => fetchedUsers.push(user))
    }
  });

  return [
    ...existingUsers,
    ...fetchedUsers,
  ];
};


export const getStreamerToken = (id) => fetch(
  `${PROXY_URL}/https://get-fated-tts-token.pennney.workers.dev?id=${id}`
);

export const loadStreamerToken = async (sessionData) => {
  const res = await getStreamerToken(sessionData.streamer.id);
  const token = await res.text();
  if(token) {
    sessionData.streamer.token = token;
    return false;
  }
  return true;
}
