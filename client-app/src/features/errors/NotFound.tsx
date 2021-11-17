import { Link } from "react-router-dom";
import { Button, Header, Icon, Segment } from "semantic-ui-react";

export default function NotFound() {
    return (
        <Segment placeholder>
            <Header icon>
                <Icon name='search' />
                Yeah we didn't find it.
            </Header>
            <Segment.Inline>
                <Button as={Link} to='/activities' primary>Return to Activities</Button>
            </Segment.Inline>
        </Segment>
    )
}