import { formatSalt, predictContractAddress } from '@organigram/js'

const boardOfDirectorsSalt = formatSalt()
const executiveTeamSalt = formatSalt()
const electExecutiveTeamProcedureSalt = formatSalt()
const electExecutiveTeamProcedureAddress = predictContractAddress({
  type: 'VoteProcedure',
  chainId: '11155111',
  salt: electExecutiveTeamProcedureSalt
})
const boardOfDirectorsAddress = predictContractAddress({
  type: 'Organ',
  chainId: '11155111',
  salt: boardOfDirectorsSalt
})
const executiveTeamAddress = predictContractAddress({
  type: 'Organ',
  chainId: '11155111',
  salt: executiveTeamSalt
})

export const exampleOrganigram = {
  id: null,
  name: 'Example',
  description: 'This is an example organigram.',
  organs: [
    {
      address: boardOfDirectorsAddress,
      name: 'Board of directors',
      description: '',
      cid: '',
      entries: []
    },
    {
      address: executiveTeamAddress,
      name: 'Executive team',
      description: '',
      permissions: [
        {
          permissionAddress: electExecutiveTeamProcedureAddress
        }
      ],
      cid: '',
      entries: []
    }
  ],
  procedures: [
    {
      address: electExecutiveTeamProcedureAddress,
      name: 'Elect executive team',
      description:
        'This procedure does not have a description yet. You can edit it by clicking here.',
      cid: '',
      typeName: 'vote',
      data: null,
      sourceOrgans: [
        {
          organAddress: boardOfDirectorsAddress,
          permissionValue: 12,
          types: [
            {
              name: 'deciders',
              label: 'Approve proposals'
            },
            {
              name: 'proposers',
              label: 'Create proposals'
            }
          ],
          asset: null
        }
      ],
      targetOrgans: [
        {
          permissionValue: 12,
          organAddress: executiveTeamAddress
        }
      ],
      type: {
        name: 'vote',
        label: 'Simple Majority Vote',
        description:
          'A vote allows any user in the source organ to vote on proposals to add, edit or replace one or many entries, assets or procedures in the target organ.',
        fields: [
          {
            name: 'majoritySize',
            label: 'Majority size',
            type: 'number',
            description: '',
            defaultValue: '1',
            options: null
          },
          {
            name: 'quorumSize',
            label: 'Quorum size',
            type: 'number',
            description: '',
            defaultValue: '1',
            options: null
          },
          {
            name: 'voteDuration',
            label: 'Vote duration',
            type: 'number',
            description: 'Duration of the vote phase, as a number of blocks.',
            defaultValue: '8',
            options: null
          }
        ]
      }
    }
  ],
  assets: []
}
