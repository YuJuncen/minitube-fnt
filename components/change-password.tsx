import utils from "../lib/utils";
import { Stack, Separator, PrimaryButton, MessageBar, MessageBarType } from "@fluentui/react";
import Client from "../lib/miniclient";
import { useState } from "react";
import ErrorNotification from "./error-notification";

export default function ChangePassword({ client }: { client: Client }) {
    const [OriginalPasswordInput, originalPassword] = utils.useBoundInput({ label: "原先的密码", type: 'password' })
    const [NewPasswordInput, newPassword] = utils.useBoundInput({ label: "新密码", type: 'password' })
    const [NewPasswordRepeatInput, newPasswordRepeat] = utils.useBoundInput({ type: 'password', label: "确认新密码", onGetErrorMessage: () => newPassword == newPasswordRepeat ? '' : '两次确认密码不一致哦!' })
    const [state, setState] = useState<any>({ success: null })
    const [working, manager] = utils.useWork()
    const changePassword = async () => {
        const result = await utils.startWork(() => client.changePassword(originalPassword, newPassword), manager)
        if (Client.isOK(result)) {
            setState({ success: true })
            return
        }
        setState({ success: false, error: result })
    }
    return <Stack tokens={{childrenGap: 12}}>
        {state.success !== null &&
            (state.success ?
                <MessageBar messageBarType={MessageBarType.success}>修改成功辣!</MessageBar> :
                <ErrorNotification error={state.error} />
            )
        }
        {[
            OriginalPasswordInput,
            <Separator />,
            NewPasswordInput,
            NewPasswordRepeatInput
        ]}
        <PrimaryButton
            onClick={changePassword}
            disabled={newPassword != newPasswordRepeat || working}>
            确认修改
        </PrimaryButton>
    </Stack>
}