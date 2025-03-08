/**
 * The Expo CLI will automatically load environment variables with an EXPO_PUBLIC_ prefix from .env 
 * files for use within your JavaScript code whenever you use the Expo CLI, 
 * such as when running npx expo start to start your app in local development mode.
 * https://docs.expo.dev/guides/environment-variables 
 */

export const ConfigApiURL = {
    base_url : process.env.EXPO_PUBLIC_BASE_API_URL,
    prefix_url : process.env.EXPO_PUBLIC_PREFIX_URL,
    env_url : process.env.EXPO_PUBLIC_ENV_URL || '' // env diawali dengan tanda (" / "),
}