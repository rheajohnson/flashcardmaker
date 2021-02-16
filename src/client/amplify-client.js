import Auth from "@aws-amplify/auth";
import AmplifyConfig from "../configs/amplify-config";

const amplifyClient = () => {
  Auth.configure(AmplifyConfig);
  return Auth;
};

export default amplifyClient;
