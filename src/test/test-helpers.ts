export function signupReq(email = "test@test.com", password = "password123") {
  return new Request("http://localhost:3000/api/sign-up", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export function loginReq(email = "test@test.com", password = "password123") {
  return new Request("http://localhost:3000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export function logoutReq() {
  return new Request("http://localhost:3000/api/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
