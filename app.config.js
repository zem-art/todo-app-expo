import 'dotenv/config'; // to be able to read .env

export default ({ config }) => {
    const version = process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0';
    const versionCode = parseInt(process.env.EXPO_PUBLIC_VERSION_CODE || '1');
    
    return {
        ...config,
        name: "todo-expo-app",
        slug: "todo-expo-app",
        version,
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme : "myapp",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        splash: {
            image: "./assets/images/icon.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        updates: {
            fallbackToCacheTimeout: 0,
            url: "https://u.expo.dev/45ea338a-32a3-4f4c-bb99-c4dd98bb4a08",
        },
        runtimeVersion: {
            policy: 'appVersion',  // supaya auto track runtime version berdasarkan appVersion
        },
        assetBundlePatterns: [
            "**/*"
        ],
        ios: {
            ...config.ios,
            buildNumber: versionCode.toString(),
            supportsTablet: true,
        },
        android: {
            ...config.android,
            adaptiveIcon: {
                foregroundImage: "./assets/images/icon.png",
                backgroundColor: "#ffffff"
            },
            package: "com.learning_apps.todoexpoapp",
            versionCode,
        },
        web: {
            ...config.web,
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/icon.png",
        },
        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/icon.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff"
                }
            ]
        ],
        experiments: {
            typedRoutes: true
        },
        extra : {
            router : {
                origin : false,
            },
            eas : {
                projectId: "45ea338a-32a3-4f4c-bb99-c4dd98bb4a08",
            },
        }
    }
}