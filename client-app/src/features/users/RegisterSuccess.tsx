import { toast } from "react-toastify";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import agent from "../../app/api/agent";
import useQuery from "../../app/common/util/hooks";

export default function RegisterSuccess() {
    const email = useQuery().get('email') as string;

    function handleConfirmEmailResend() {
        agent.Account.resendEmail(email).then(() => {
            toast.success('Email sent');
        }).catch(error => console.log(error));
    }

    return (
        <Segment placeholder textAlign='center'>
            <Header icon color='green'>
                <Icon name='check' />
                Successfully registered.
            </Header>
            <p>Check your email</p>
            {
                email &&
                <>
                    <p>Click the resend</p>
                    <Button primary onClick={handleConfirmEmailResend} content='Resend' size='huge' />
                </>
            }
        </Segment>
    )
}