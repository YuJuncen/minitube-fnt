import { DocumentCardTitle, DocumentCard, DocumentCardActivity, DocumentCardType, IDocumentCardPreviewProps, DefaultPalette, DocumentCardPreview, IconNames, DefaultFontStyles, IDocumentCard, IDocumentCardProps } from "@fluentui/react";
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
    const previewPropsUsingIcon: IDocumentCardPreviewProps = {
        previewImages: [
            {
                previewIconProps: {
                    iconName: 'Streaming',
                    styles: { root: { fontSize: DefaultFontStyles.superLarge.fontSize, color: DefaultPalette.white } },
                },
            },
            
        ],
        styles: { previewIcon: { backgroundColor: live?.living ? color : DefaultPalette.blackTranslucent40}, root: {height: "10em"} },
    };
    const router = useRouter()
    const toLive = useCallback(() => router.push(`/live/${live.username}`), null)
    const liveTime = useMemo(() => live.living ? `主播在 ${timeago.format(live.start_time, 'zh_CN')} 开播～` : "主播走了！", [live])
    return (
        <DocumentCard
            {...props}
            onClick={toLive}>
            <DocumentCardPreview {...previewPropsUsingIcon} />
            <DocumentCardTitle styles={{root: {height: "auto", paddingBottom: 0}}} title={live.live_name || `${live.username} 的直播间`} />
            <DocumentCardTitle styles={{root: {height: "auto", paddingBottom: 0}}} showAsSecondaryTitle title={live.live_intro} />
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