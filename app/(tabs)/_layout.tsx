import CustomTabs from "@/components/CustomTabs";
import { Tabs } from "expo-router";

const _layout = () => {
    return (
        <Tabs tabBar={(props) => <CustomTabs {...props} />} screenOptions={{ headerShown: false }}>
            <Tabs.Screen name={"index"} />
            <Tabs.Screen name={"map"} />
            <Tabs.Screen name={"spots"} />
            <Tabs.Screen name={"profile"} />
        </Tabs>
    );
};

export default _layout;
