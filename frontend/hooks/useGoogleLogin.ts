import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import { useEffect } from "react";
import { Platform } from "react-native";
import Constants, { ExecutionEnvironment } from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleLogin(onSuccess: (idToken: string) => void) {
  
  // Detect if we are running in Expo Go
  const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

  // Generate the Redirect URI
  // For Expo Go: Forces 'https://auth.expo.io/@mohansg/senso-plant-care'
  // For Production: Forces 'sensoplantcare://google-auth'
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: isExpoGo ? undefined : "sensoplantcare",
    path: "google-auth",
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "652596596728-bmectm4sif7lluei6pl01rvnmfgg6a0a.apps.googleusercontent.com",
    androidClientId: "652596596728-vmshk387vph16titqd59pjsjfkm8k93k.apps.googleusercontent.com",
    iosClientId: "652596596728-h7d3jbg1jhv9vu3ebbq19tf5s2cofbui.apps.googleusercontent.com",
    redirectUri,
  });

  useEffect(() => {
    if (request) {
      console.log("================================================");
      console.log("🛠️  GOOGLE OAUTH SYNC STATUS");
      console.log("================================================");
      console.log("MODE:", isExpoGo ? "Testing (Expo Go)" : "Production (Native)");
      console.log("REDIRECT URI:", request.redirectUri);
      console.log("================================================");
    }

    if (response?.type === "success") {
      const { idToken } = response.authentication || {};
      if (idToken) onSuccess(idToken);
    }
  }, [response, request]);

  return { 
    promptAsync: () => promptAsync(),
    disabled: !request 
  };
}
