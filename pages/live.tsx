import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('../components/live'),
  { ssr: false }
)

export default function Live() {
    return <DynamicComponentWithNoSSR />
}