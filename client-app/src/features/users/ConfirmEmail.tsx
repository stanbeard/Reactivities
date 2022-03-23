import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import agent from "../../app/api/agent";
import useQuery from "../../app/common/util/hooks";
import { useStore } from "../../app/stores/store";
import LoginForm from "./LoginForm";

export default function ConfirmEmail() {
    const { modalStore } = useStore();
    const email = useQuery().get('email') as string;
    const token = useQuery().get('token') as string;

    const Status = {
        Verifying: 'Verifying',
        Failed: 'Failed',
        Success: 'Success'
    }

    const [status, setStatus] = useState(Status.Verifying);

    function handleConfirmEmailResend() {
        agent.Account.resendEmail(email).then(() => {
            toast.success('Email sent');
        }).catch(error => console.log(error));
    }

    useEffect(() => {
        agent.Account.verifyEmail(token, email).then(() => {
            setStatus(Status.Success);
        }).catch(() => {
            setStatus(Status.Failed)
        });
    }, [Status.Failed, Status.Success, token, email]);

    function getBody() {
        switch (status) {
            case Status.Verifying:
                return <p>Verifying...</p>;
            case Status.Failed:
                return <div>
                    <p>Failed</p>
                    <Button primary onClick={handleConfirmEmailResend} content='Resend' />
                </div>
            case Status.Success:
                return <div>
                    <p>Success</p>
                    <Button primary onClick={() => modalStore.openModal(<LoginForm />)} />
                </div>
        }
    }

    return (
        <Segment>
            <Header icon>
                <Icon name='envelope' />
                Email verification
            </Header>
            <Segment.Inline>
                {getBody()}
            </Segment.Inline>
        </Segment>
    )

}