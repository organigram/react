import { useState } from 'react'
import { useOrganigramClient } from './useOrganigramClient'
import { Organigram } from '@organigram/js'

export const useOrganigram = ({
  initOrganigram,
  options
}: {
  initOrganigram?: Organigram
  options?: any
}) => {
  const { organigramClient } = useOrganigramClient()
  const [currentOrganigram, setCurrentOrganigram] = useState<Organigram | null>(
    new Organigram(initOrganigram!)
  )

  const deploy = async () => {
    if (organigramClient == null || currentOrganigram == null) return
    await currentOrganigram.deploy()
  }

  return {
    currentOrganigram,
    setCurrentOrganigram,
    deploy
  }
}
