import { DocumentCardTitle, DocumentCard, DocumentCardActivity, DocumentCardType, IDocumentCardPreviewProps, DefaultPalette, DocumentCardPreview, IconNames, DefaultFontStyles, IDocumentCard, IDocumentCardProps, DocumentCardLogo, DocumentCardStatus } from "@fluentui/react";
import { LiveProfile } from "../lib/models";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import * as timeago from 'timeago.js';
const colors = [
    DefaultPalette.themeDarker,
    DefaultPalette.themeDark,
    DefaultPalette.themeDarkAlt,
]
export default function LiveCard({live, ...props}: {live: LiveProfile} & IDocumentCardProps) {
    const color = useMemo(() => colors[Math.floor(Math.random() * 3)], [])
    const router = useRouter()
    const toLive = useCallback(() => router.push(`/live/${live.username}`), null)
    const liveTime = useMemo(() => live.living ? `${timeago.format(live.start_time, 'zh_CN')}开播` : "未开播", [live])
    return (
        <DocumentCard
            {...props}
            onClick={toLive}>
            <DocumentCardLogo logoIcon="Streaming"></DocumentCardLogo>
            <DocumentCardTitle styles={{root: {height: "auto", paddingBottom: 0}}} title={live.live_name || `${live.username} 的直播间`} />
            <DocumentCardTitle styles={{root: {height: "auto", paddingBottom: 0}}} showAsSecondaryTitle title={live.live_intro || '随便播一下～'} />
            <DocumentCardStatus statusIcon={'People'} status={`${Math.max(0, live.watching)} 人观看`} />
            <DocumentCardActivity
                activity={liveTime}
                people={[{
                    name: live.username,
                    initials: live.username.split(' ').map(x => (x[0] || '').toUpperCase()).join(''),
                    profileImageSrc: ''
                }]}
            />

        </DocumentCard>
    )
}