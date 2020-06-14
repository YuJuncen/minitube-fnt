import dynamic from 'next/dynamic'
import Title from '../components/title'
import { Stack } from '@fluentui/react'
import DanmakuList from '../components/danmaku'

const Video = dynamic(
  () => import('../components/live'),
  { ssr: false }
)

export default function Live() {
  return (
    <Stack>
      <Title text="直播"></Title>
      <Stack horizontal>
        <Video />
        <DanmakuList />
      </Stack>
    </Stack>
  )
}