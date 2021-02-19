import AmplifyClient from "../client/amplify-client";

const register = async (username, email, password) => {
  const amplifyClient = AmplifyClient();
  const { user } = await amplifyClient.signUp({
    username,
    password,
    email,
  });
  console.log("register: ", user);
  return user;
};

const confirmSignUp = async (username, code) => {
  const amplifyClient = AmplifyClient();
  const response = await amplifyClient.confirmSignUp(username, code);
  console.log("response: ", response);
  return response;
};

const resendConfirm = async (username) => {
  const amplifyClient = AmplifyClient();
  const response = await amplifyClient.resendSignUp(username);
  console.log("response: ", response);
  return response;
};

const login = async (username, password) => {
  const amplifyClient = AmplifyClient();
  const user = await amplifyClient.signIn({
    username,
    password,
  });
  console.log("login: ", user);
  return user;
};

const getAccessToken = async () => {
  const amplifyClient = AmplifyClient();
  return await amplifyClient.currentSession().then((res) => {
    let accessToken = res.getIdToken();
    let jwt = accessToken.getJwtToken();
    //You can print them to see the full objects
    return JSON.stringify(jwt);
  });
};

const getSession = async () => {
  const amplifyClient = AmplifyClient();
  return await amplifyClient.currentSession().then((res) => {
    return res.accessToken;
  });
};

const logout = async () => {
  const amplifyClient = AmplifyClient();
  await amplifyClient.signOut({ global: true });
};

export default {
  register,
  confirmSignUp,
  resendConfirm,
  login,
  getAccessToken,
  logout,
  getSession,
};
