import { Tab } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import ProfileFollowings from "./ProfileFollowings";
import ProfilePhotos from "./ProfilePhotos";

interface Props {
    profile: Profile;
}

export default function ProfileContent({ profile }: Props) {
    const { profileStore } = useStore();

    const panes = [
        { menuItem: 'About', render: () => <Tab.Pane>About content</Tab.Pane> },
        { menuItem: 'Photos', render: () => <ProfilePhotos profile={profile} /> },
        { menuItem: 'Events', render: () => <Tab.Pane>Events content</Tab.Pane> },
        { menuItem: 'Followers', render: () => <ProfileFollowings /> },
        { menuItem: 'Following', render: () => <ProfileFollowings /> },
    ];

    return (
        <Tab
            menu={{ fluid: true, vertical: true }}
            menuPosition='right'
            panes={panes}
            onTabChange={(e, data) => profileStore.setActiveTab(data.activeIndex)} 
        />
    )
}