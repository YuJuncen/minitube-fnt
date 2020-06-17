import { Fail } from '../lib/miniclient'
import { IMessageBarProps, MessageBar, MessageBarType } from '@fluentui/react';
import utils from '../lib/utils';
import errors from '../lib/errors';

export default function ErrorNotification({error, ...props} : {error: Fail} & IMessageBarProps) {
    return <MessageBar messageBarType={MessageBarType.error} {...props}>
        <b>[ {error.code || "???"} ]</b> {errors.messageByObj(error)}
    </MessageBar>
}