import { observer } from 'mobx-react-lite';
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import { Button, Item, Label, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';

export default observer(function ActivityList() {
    const [target, setTarget] = useState('');
    const { activityStore } = useStore();
    const { activitiesByDate, deleteActivity, loading } = activityStore;

    function handleActivityDelete(e: React.SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }

    return (
        <Segment>
            <Item.Group divided>
                {activitiesByDate.map(activity => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as="a">{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button as={NavLink} to={`/activities/${activity.id}`} floated="right" content="View" color="blue" />
                                <Button loading={loading && target === activity.id}  name={activity.id} onClick={(e) => handleActivityDelete(e, activity.id)} floated="right" content="Delete" color="red" />
                                <Label basic content={activity.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    );
})