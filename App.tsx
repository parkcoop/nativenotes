import React, { useEffect, useReducer, useState } from "react";
import { NativeModules } from "react-native";
import AppNavigator from "./src/routes";
import * as eva from "@eva-design/eva";
// import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { SessionContext, ThemeContext } from "./src/context";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import FlashMessage from "react-native-flash-message";
import moment from "moment";
import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { default as customTheme } from "./theme.json";
import { default as mapping } from "./mapping.json";

interface User {
    readonly _id: string;
    readonly username: string;
    readonly avatar: string;
}

type Action = {
    type: string | null;
    user: User | null;
    token: string | null;
};

type State = {
    token: string | null;
    user: User | null;
};
const App: React.FC = () => {
    const [theme, setTheme] = useState<string>("light");
    // let StringProvider = NativeModules.StringProvider;
    // console.log(StringProvider.getParkersString((data) => console.log(data)));
    const toggleTheme = async () => {
        const nextTheme = theme === "light" ? "dark" : "light";
        setTheme(nextTheme);
        await AsyncStorage.setItem("theme", nextTheme);
    };

    const userReducer = (prevState: State, action: Action) => {
        switch (action.type) {
            case "RESTORE_TOKEN":
                return {
                    ...prevState,
                    token: action.token,
                    user: action.user,
                };
            case "SIGN_IN":
                return {
                    ...prevState,
                    token: action.token,
                    user: action.user,
                };
            case "SIGN_OUT":
                (async () => {
                    await AsyncStorage.removeItem("token");
                })();
                return {
                    token: null,
                    user: null,
                };
            default:
                return {
                    token: null,
                    user: null,
                };
                throw new Error();
        }
    };

    const [session, dispatch] = useReducer(userReducer, {
        token: null,
        user: null,
    });

    useEffect(() => {
        const checkToken = async () => {
            let user;
            let userToken;
            let tokenExpiration;
            // await AsyncStorage.removeItem('userToken')
            // await AsyncStorage.removeItem('tokenExpiration')

            try {
                userToken = await AsyncStorage.getItem("token");
                tokenExpiration = await AsyncStorage.getItem("tokenExpiration");
                let theme = await AsyncStorage.getItem("theme");
                if (theme) setTheme(theme);
                console.log(
                    "Expires in: (minutes) ",
                    // @ts-ignore
                    moment.unix(tokenExpiration).diff(moment(), "minutes"),
                );
                if (
                    // @ts-ignore
                    moment().diff(moment.unix(tokenExpiration), "minutes") >
                        0 ||
                    !tokenExpiration
                ) {
                    await AsyncStorage.removeItem("token");
                    await AsyncStorage.removeItem("tokenExpiration");
                    userToken = null;
                }
            } catch (err) {
                console.log("error retrieving token", err);
            }
            if (userToken && userToken !== "undefined") {
                user = jwt_decode(userToken);
                console.log("DECODED", user);
            }
            dispatch({
                type: "RESTORE_TOKEN",
                // @ts-ignore
                token: userToken,
                // @ts-ignore
                user: user?.foundUser,
            });
        };

        checkToken();
    }, []);

    return (
        <ApplicationProvider
            {...eva}
            theme={{ ...eva[theme], ...customTheme }}
            customMapping={mapping}
        >
            <IconRegistry icons={EvaIconsPack} />
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
                <SessionContext.Provider value={{ session, dispatch }}>
                    <AppNavigator />
                    <FlashMessage position="top" />
                </SessionContext.Provider>
            </ThemeContext.Provider>
        </ApplicationProvider>
    );
};

export default App;
