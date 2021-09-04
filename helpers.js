const emailSearch = function(userEmail, database) {
  for (item in database) {
    if (database[item].email === userEmail) {
      return database[item];
    }
  }
  return false;
};

const urlsForUser = function(id, data) {
  let newObject = {};
  for (url in data) {
    if (data[url].userID === id) {
      newObject[url] = {
        longURL: data[url].longURL,
        userID: data[url].userID
      };
    }
  }
  return newObject;
};

const generateRandomString = function(len) {
  let ans = '';
  const array = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrtsuvwxyz123456789123456789123456789123456789';
  for (let i = len; i > 0; i--) {
    ans +=
      array[Math.floor(Math.random() * array.length)];
  }
  return ans;
};

module.exports = {emailSearch, urlsForUser, generateRandomString};