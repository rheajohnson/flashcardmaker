import AmplifyClient from "../client/amplify-client";
import UserService from "./user-service";

const register = async (username, email, password) => {
  const amplifyClient = AmplifyClient();
  const { user } = await amplifyClient.signUp({
    username,
    password,
    attributes: {
      email,
    },
  });
  return user;
};

const resendSignUp = async (username) => {
  const amplifyClient = AmplifyClient();
  const response = await amplifyClient.resendSignUp(username);
  return response;
};

const login = async (username, password) => {
  const amplifyClient = AmplifyClient();
  const user = await amplifyClient.signIn({
    username,
    password,
  });
  return user;
};

const getAccessToken = async () => {
  const amplifyClient = AmplifyClient();
  return await amplifyClient.currentSession().then((res) => {
    let accessToken = res.getIdToken();
    let jwt = accessToken.getJwtToken();
    return JSON.stringify(jwt);
  });
};

const getUser = async () => {
  try {
    const amplifyClient = AmplifyClient();
    const currentUser = await amplifyClient.currentAuthenticatedUser();

    const userAttributesResponse = await amplifyClient.userAttributes(
      currentUser
    );
    const response = {};
    for (const attribute of userAttributesResponse) {
      response[attribute.Name] = attribute.Value;
    }
    response.username = currentUser.username;

    let userDDB = null;

    userDDB = await UserService.getUser(response.sub);
    if (!userDDB) {
      const { sub: id, username, email } = response;
      userDDB = await UserService.createUser(id, username, email);
    }
    response.userRole = userDDB.userRole;
    response.sets = userDDB.sets;

    return response;
  } catch (err) {
    return null;
  }
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
  resendSignUp,
  login,
  getAccessToken,
  getUser,
  logout,
  getSession,
};
