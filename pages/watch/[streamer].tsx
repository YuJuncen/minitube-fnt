import dynamic from 'next/dynamic'
import Title from '../../components/title'
import { Stack, Text, Persona, IPersonaProps, Separator, Shimmer } from '@fluentui/react'
import DanmakuList from '../../components/danmaku'
import { DateTime } from 'luxon'
import { EventEmitter } from 'events'
import { useEffect, useState, useMemo } from 'react'
import Client from '../../lib/miniclient'
import errors from '../../lib/errors'
import UserPersona from '../../components/user-persona'
import { useRouter } from 'next/router'
import { Profile } from '../../lib/modles'

const Video = dynamic(
  () => import('../../components/live'),
  { ssr: false }
)

export default function Live() {
  const danmakuEvents = useMemo(() => new EventEmitter(), [])
  const [user, setUser] = useState(null)
  const [streamer, setStreamer] = useState<Profile>(null)
  const router = useRouter()
  const streamerName = router.query.streamer as string
  console.log(router.query, streamerName)
  useEffect(() => {
    const danmus = setInterval(() => danmakuEvents.emit('danmaku', {
      size: '28px',
      color: '#ffffff',
      content: `yan 太强了!`,
      time: DateTime.local().toString(),
      user: { username: 'mgw' }
    }), 1000)
    Client.global().whoAmI().then(result => {
      if (Client.isOK(result)) {
        setUser(result.user)
        return
      }
      console.log(errors.messageByObj(result))
    })
    console.log(router.query, streamerName)
    Client.global().getProfileOf(streamerName as string).then(result => {
      if (Client.isOK(result)) {
        setStreamer(result.user)
        return
      }
    })
    return () => clearInterval(danmus)
  }, [streamerName])

  return (
    <Stack horizontalAlign="center">
      <Stack>
        <Title text="直播"></Title>
        <Stack horizontal >
          <Video danmakuEvents={danmakuEvents} currentUser={user} streamer={streamerName} />
          <DanmakuList danmakus={danmakuEvents} currentUser={user} />
        </Stack>
        <Separator></Separator>
        {streamer != null ?
        <Stack horizontal horizontalAlign="space-between">
          <Stack style={{maxWidth: '50%'}}>
            <Text block variant="xxLarge">{streamer.live_name || `${streamerName} 的无名直播间` }</Text>
            <Text block>{streamer.live_intro}</Text>
          </Stack>
          <Persona primaryText={streamerName || "????"}></Persona>
        </Stack> :
        <Shimmer></Shimmer>
        }
      </Stack>
    </Stack>
  )
}