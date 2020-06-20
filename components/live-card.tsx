import { DocumentCardTitle, DocumentCard, DocumentCardActivity, DocumentCardType, IDocumentCardPreviewProps, DefaultPalette, DocumentCardPreview, IconNames, DefaultFontStyles, IDocumentCard, IDocumentCardProps } from "@fluentui/react";
import { LiveProfile } from "../lib/modles";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
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
        styles: { previewIcon: { backgroundColor: color}, root: {height: "10em"} },
    };
    const router = useRouter()
    const toLive = useCallback(() => router.push(`/watch/${live.username}`), null)
    const fakeLivePeoples = useMemo(() => `现在有 ${Math.trunc(Math.random() * 10000)} 人在观看！`, [])
    return (
        <DocumentCard
            {...props}
            onClick={toLive}>
            <DocumentCardPreview {...previewPropsUsingIcon} />
            <DocumentCardTitle styles={{root: {height: "auto", paddingBottom: 0}}} title={live.live_name || `${live.username} 的直播间`} />
            <DocumentCardTitle styles={{root: {height: "auto", paddingBottom: 0}}} showAsSecondaryTitle title={live.live_intro} />
            <DocumentCardActivity
                activity={fakeLivePeoples}
                people={[{
                    name: live.username,
                    initials: live.username.split(' ').map(x => (x[0] || '').toUpperCase()).join(''),
                    profileImageSrc: ''
                }]}
            />

        </DocumentCard>
    )
}