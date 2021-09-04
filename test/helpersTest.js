const { assert } = require('chai');

const { generateRandomString, urlsForUser, emailSearch } = require("../helpers");

const testUsers = {
  "userRandomID": {id: "userRandomID", email: "user@example.com", password: "purple-monkey-dinosaur"},
  "user2RandomID": {id: "user2RandomID", email: "user2@example.com", password: "dishwasher-funk"}
};

const testDatabase = {
  object1: { longURL: "https://www.test1.com", userID: "aJ48lW" },
  object2: { longURL: "https://www.test2.com", userID: "aJ48lW" },
  object3: { longURL: "https://www.test3.com", userID: "BJ50lW" },
  object4: { longURL: "https://www.test4.ca", userID: "BJ50lW" }
};

describe('emailSearch', function() {
  it('should return a user object with valid email', function() {
    const user = emailSearch("user@example.com", testUsers);
    const userID = user.id;
    assert.strictEqual(userID, "userRandomID");
  });
  it('should return false if email not found', function() {
    assert.strictEqual(emailSearch("user@example.ca", testUsers), false);
  });
});

describe('urlsForUser', function() {
  it('should return an object containing URLs for the same user ID', function() {
    assert.deepEqual(urlsForUser("BJ50lW", testDatabase), {object3: {longURL: 'https://www.test3.com', userID: 'BJ50lW' }, object4: { longURL: 'https://www.test4.ca', userID: 'BJ50lW'}});
  });
  it('should return empty object {} if user id not found', function() {
    assert.deepEqual(urlsForUser("ybyyve", testDatabase), {});
  });
});

describe('generateRandomString', function() {
  it('should return a string with six characters', function() {
    const stringLength = generateRandomString(6).length;
    assert.equal(stringLength, 6);
  });
  it('should be a random string and does not repeat when called multiple times', function() {
    const randomStringOne = generateRandomString(6);
    const randomStringTwo = generateRandomString(6);
    assert.notEqual(randomStringOne, randomStringTwo);
  });
});

