const { PublicClientApplication } = require('@azure/msal-node');


const config = {
    auth: {
      clientId: '50cc58b0-1a99-4e05-a345-1848fd7ae055',
      authority: 'https://login.microsoftonline.com/common',
    },
};

console.log('Connected to MSAL.');

const msalInstance = new PublicClientApplication(config);

// Function to acquire a token
async function acquireToken() {
    const tokenRequest = {
        scopes: ['user.read'], // Specify the required permissions
    };

    try {
        const response = await msalInstance.acquireTokenByClientCredential(tokenRequest);
        const accessToken = response.accessToken;
        console.log('Access token:', accessToken);
        // Use the access token for your API requests.
    } catch (error) {
        console.error('Token acquisition error:', error);
    }
}

// Use the loginPopup method to initiate the login process
async function login() {
  const loginRequest = {
    scopes: ['User.Read'], // Adjust the scopes as needed
  };

  try {
      const response = await msalInstance.loginPopup(loginRequest);
      // Handle the response, e.g., update UI or access the access token
      console.log('Logged in:', response);
  } catch (error) {
      console.error('Login error:', error);
  }
}

module.exports = {
    msalInstance,
    acquireToken,
    login,
};