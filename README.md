To run the server:

- Make a JSON file called users.json in the root level of the webserver directory.
  Populate it with allowed usernames and passwords, e.g.
  ```
  {
    "postgresuser": "username",
    "postgrespw": "password",
    "webauth": {
      "someuser":"somepassword", 
      ...
    }
  }
  ```
  At best the authentication level is a mild deterrent so don't reuse passwords from
  elsewhere. The file is at least ignored by git to avoid leaking passwords to Github.
- `npm start` in the package directory.

This handles serving up web pages and server-side PostgreSQL queries. The web page itself is
hosted in another repository, [PainterQubits/webfrontend](https://github.com/PainterQubits/webfrontend).
See instructions there for how to build the webpage and serve it using this repository.
