import { OrganigramClient, OrganJson } from '@organigram/js'

export const getDeployedOrganData = async (
  organAddress?: string | null,
  client?: OrganigramClient | null
): Promise<OrganJson | undefined> => {
  if (organAddress == null || organAddress === '') {
    return undefined
  }
  const organ = await client?.getDeployedOrgan(organAddress).catch(e => {
    console.error(e.message)
  })
  if (organ != null) return organ.toJson()
}
