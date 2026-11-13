import HomePageClient from './HomePageClient'

export const metadata = { title: 'Molecular Roastery' }

/** Static demo, German (site default). Content comes from the built-in defaults. */
export default function Page() {
  return <HomePageClient home={null} locale="de" />
}
