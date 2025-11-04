import CustomTabs from "@/components/navigation/CustomTabs";
import { Tabs } from "expo-router";
import {NavigationProvider} from "@/contexts/NavigationContext";

const _layout = () => {
    return (
        <NavigationProvider>
            <Tabs
                tabBar={(props) => <CustomTabs {...props} />}
                screenOptions={{
                    headerShown: false
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Accueil"
                    }}
                />
                <Tabs.Screen
                    name="map"
                    options={{
                        title: "Carte"
                    }}
                />
                <Tabs.Screen
                    name="spots"
                    options={{
                        title: "Spots"
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Profil"
                    }}
                />
            </Tabs>
        </NavigationProvider>

    );
};

export default _layout;