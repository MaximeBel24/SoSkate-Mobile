import CustomTabs from "@/components/navigation/CustomTabs";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { Tabs } from "expo-router";

const _layout = () => {
  return (
    <NavigationProvider>
      <Tabs
        tabBar={(props) => <CustomTabs {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Accueil",
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: "Carte",
          }}
        />
        <Tabs.Screen
          name="spots"
          options={{
            title: "Spots",
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profil",
          }}
        />
      </Tabs>
    </NavigationProvider>
  );
};

export default _layout;
