import { Action, ActionPanel, closeMainWindow, Form, getPreferenceValues, LaunchProps, popToRoot } from "@raycast/api";
import { App as SlackApp } from "@slack/bolt";
import { createReadStream } from "fs";
import { basename } from "path";
import { useMemo } from "react";

type FormValues = {
    message: string,
    image: [string],
}

type Preferences = {
    slackToken: string,
    slackChannelId: string,
}

async function submitForm(slackApp: SlackApp, slackChannelId: string, values: FormValues) {
    const imagePath = values.image[0];

    await slackApp.client.files.uploadV2({
        file: createReadStream(imagePath),
        filename: basename(imagePath),
        channel_id: slackChannelId,
        alt_text: values.message,
        title: values.message
    })

    await popToRoot({ clearSearchBar: true });
    await closeMainWindow();
}

export default function Reminder(props: LaunchProps<{ arguments: Arguments.Send }>) {
    const { imagePath } = props.arguments;
    const { slackToken, slackChannelId } = getPreferenceValues<Preferences>();
    const slackApp = useMemo(() => new SlackApp({
        token: slackToken,
        signingSecret: 'not-needed',
    }), [slackToken]
    );

    return (
        <Form
            actions={
                <ActionPanel>
                    <Action.SubmitForm title="Create Reminder" onSubmit={(values) => submitForm(slackApp, slackChannelId, values as FormValues)} />
                </ActionPanel>
            }
        >
            <Form.TextField id="message" title="Message" placeholder="Reply to..." />
            <Form.FilePicker id="image" title="Image" allowMultipleSelection={false} defaultValue={[imagePath]} />
        </Form>
    )
}