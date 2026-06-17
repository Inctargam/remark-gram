import { PasswordRecoveryPage } from '@/pages/password-recovery'

type Props = {
  searchParams: Promise<{
    email?: string | string[]
  }>
}

const getEmailSearchParam = (email: string | string[] | undefined) => {
  if (Array.isArray(email)) {
    return email[0] ?? null
  }

  return email ?? null
}

export default async function Page({ searchParams }: Props) {
  const { email } = await searchParams

  return <PasswordRecoveryPage email={getEmailSearchParam(email)} />
}
