import { ProfilePage } from '@/pages/profile'

type Props = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
  const { id } = await params

  return <ProfilePage userId={id} />
}
