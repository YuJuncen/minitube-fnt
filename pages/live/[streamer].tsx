import dynamic from 'next/dynamic'
import Title from '../../components/title'
import { Stack, Text, Persona, IPersonaProps, Separator, Shimmer, DefaultPalette, PrimaryButton, DefaultButton } from '@fluentui/react'
import DanmakuList from '../../components/danmaku'
import { DateTime } from 'luxon'
import { EventEmitter } from 'events'
import { useEffect, useState, useMemo, useContext, useCallback } from 'react'
import Client from '../../lib/miniclient'
import errors from '../../lib/errors'
import UserPersona from '../../components/user-persona'
import { useRouter } from 'next/router'
import models, { Profile, LiveProfile, FollowState } from '../../lib/models'
import ErrorLayer from '../../components/error-layer'
import MinitubeContext from '../../lib/global'
import utils from '../../lib/utils'

const Video = dynamic(
  () => import('../../components/live'),
  { ssr: false }
)

export default function Live() {
  const danmakuEvents = useMemo(() => new EventEmitter(), [])
  const [streamer, setStreamer] = useState<LiveProfile>(null)
  const router = useRouter()
  const {client} = useContext(MinitubeContext)
  const [working, manager] = utils.useWork()
  const streamerName = router.query.streamer as string
  useEffect(() => {
    const danmus = setInterval(() => danmakuEvents.emit('danmaku', {
      size: '28px',
      color: '#ffffff',
      content: `yan 太强了!`,
      time: DateTime.local().toString(),
      user: { username: 'mgw' }
    }), 1000)
    if (streamerName == undefined || streamerName?.length == 0) return
    client.getProfileOf(streamerName as string).then(result => {
      if (Client.isOK(result)) {
        setStreamer(result.user)
        return
      }
    })
    return () => clearInterval(danmus)
  }, [streamerName])

  return (
    <Stack horizontalAlign="center" >
      <Stack>
        <Stack horizontal >
          {streamer?.living ? 
            <Video danmakuEvents={danmakuEvents} streamer={streamerName} /> : 
            <div style={{ position: 'relative', height: '75vh', width: '133.33vh' }}>
            <ErrorLayer text="主播没有开播（或者说，也可能根本不存在这个主播）！" style={{backgroundImage: `linear-gradient(to right, ${DefaultPalette.themePrimary}, ${DefaultPalette.themeDark})`,
    color: DefaultPalette.white}}>
              </ErrorLayer></div>}
          <DanmakuList danmakus={danmakuEvents} />
        </Stack>
        <Separator></Separator>
        {streamer != null ?
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
          <Stack style={{maxWidth: '50%'}}>
            <Text block variant="xxLarge">{streamer.live_name || `${streamerName} 的无名直播间` }</Text>
            <Text block>{streamer.live_intro}</Text>
          </Stack>
          <Stack.Item grow><div></div></Stack.Item>
          <Persona primaryText={streamerName || "????"}></Persona>
          { streamer.follow != models.FollowState.UNKNOWN &&
           models.isFollowed(streamer.follow) ?
            <DefaultButton disabled={working} onClick={() => {
              utils.startWork(() => client.unfollow(streamerName)
              .then(() => {
                setStreamer(s => ({...s, follow: models.FollowState.NO_RELATION}))
              }), manager)
            }
            }>取消关注</DefaultButton> :
            <PrimaryButton disabled={working} onClick={() => {
              utils.startWork(() => client.followTo(streamerName)
              .then(() => {
                setStreamer(s => ({...s, follow: models.FollowState.I_FOLLOWED}))
              }), manager)
            }
            }>关注</PrimaryButton> 
          }
        </Stack> :
        <Shimmer></Shimmer>
        }
      </Stack>
    </Stack>
  )
}