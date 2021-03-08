import { axiosAuth } from "@/http";
import qs from "querystring";

export const authService = {
  login,
  register
};

function login({ username, password }) {
  return new Promise((resolve, reject) => {
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };

    const requestBody = {
      username: username,
      password: password,
      language: "ENG"
    };

    axiosAuth.post("/signin", qs.stringify(requestBody), config).then(
      response => {
        console.log(response);
        const token = response.headers["jwt-auth"];
        const data = {
          token: token,
          user: response.data
        };
        resolve(data);
      },
      error => {
        console.log(error.response.data.code);
        const err = {
          code: error.response.status,
          message: error.response.data.code
        };
        reject(err);
      }
    );
  });
}

function register({ username, email, fullname, password }) {
  return new Promise((resolve, reject) => {
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };

    const requestBody = {
      username: username,
      email: email,
      name: fullname,
      role: "USER",
      password: password
    };

    axiosAuth
      .post("/signup?language=ENG", qs.stringify(requestBody), config)
      .then(
        response => {
          console.log(response);
          const token = response.headers["jwt-auth"];
          const data = {
            token: token,
            user: response.data
          };
          resolve(data);
        },
        error => {
          console.log(error.response.data.code);
          const err = {
            code: error.response.status,
            message: error.response.data.code
          };
          reject(err);
        }
      );
  });
}
