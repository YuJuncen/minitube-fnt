import dynamic from 'next/dynamic'
import Title from '../components/title'
import { Stack } from '@fluentui/react'
import DanmakuList from '../components/danmaku'
import { DateTime } from 'luxon'
import { EventEmitter } from 'events'
import { useEffect, useState, useMemo } from 'react'
import Client from '../lib/miniclient'
import errors from '../lib/errors'

const Video = dynamic(
  () => import('../components/live'),
  { ssr: false }
)

export default function Live() {
  const danmakuEvents = useMemo(() => new EventEmitter(), [])
  const [user, setUser] = useState(null)
  useEffect(() => {
      const danmus = setInterval(() => danmakuEvents.emit('danmaku', {
        size: '28px', 
        color: '#ffffff', 
        content: `yan 太强了!`, 
        time: DateTime.local().toString(),
        user: {username: 'mgw'}
      }), 1000)
      Client.global().whoAmI().then(result => {
        if (Client.isOK(result)) {
          setUser(result.user)
          return
        }
        console.log(errors.messageByObj(result))
      })
      return () => clearInterval(danmus)
  }, [])
  
  return (
    <Stack horizontalAlign="center">
      <Stack>
        <Title text="直播"></Title>
        <Stack horizontal >
          <Video danmakuEvents={danmakuEvents}/>
          { user && <DanmakuList danmakus={danmakuEvents} currentUser={user}/> }
        </Stack>
      </Stack>
    </Stack>
  )
}