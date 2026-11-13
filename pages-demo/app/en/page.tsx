import HomePageClient from '../HomePageClient'

export const metadata = { title: 'Molecular Roastery' }

/** Static demo, English. */
export default function Page() {
  return <HomePageClient home={null} locale="en" />
}
