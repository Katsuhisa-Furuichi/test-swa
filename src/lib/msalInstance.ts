import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../config/authConfig';

const msalInstance = new PublicClientApplication(msalConfig);

export default msalInstance;
