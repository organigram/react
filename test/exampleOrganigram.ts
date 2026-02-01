import { formatSalt, predictContractAddress } from '@organigram/js'

const boardOfDirectorsId = formatSalt()
const executiveTeamId = formatSalt()
const electExecutiveTeamProcedureId = formatSalt()
const electExecutiveTeamProcedureAddress = predictContractAddress({
  type: 'VoteProcedure',
  chainId: '11155111',
  salt: electExecutiveTeamProcedureId
})
const boardOfDirectorsAddress = predictContractAddress({
  type: 'Organ',
  chainId: '11155111',
  salt: boardOfDirectorsId
})
const executiveTeamAddress = predictContractAddress({
  type: 'Organ',
  chainId: '11155111',
  salt: executiveTeamId
})

export const exampleOrganigram = {
  id: null,
  name: 'Example',
  description: 'This is an example organigram.',
  organs: [
    {
      id: boardOfDirectorsId,
      address: boardOfDirectorsAddress,
      name: 'Board of directors',
      description: '',
      cid: '',
      entries: []
    },
    {
      id: executiveTeamId,
      address: executiveTeamAddress,
      name: 'Executive team',
      description: '',
      procedures: [
        {
          address: electExecutiveTeamProcedureAddress
        }
      ],
      cid: '',
      entries: []
    }
  ],
  procedures: [
    {
      id: electExecutiveTeamProcedureId,
      address: electExecutiveTeamProcedureAddress,
      name: 'Elect executive team',
      description:
        'This procedure does not have a description yet. You can edit it by clicking here.',
      cid: '',
      typeName: 'vote',
      data: null,
      sourceOrgans: [
        {
          organId: boardOfDirectorsId,
          organAddress: boardOfDirectorsAddress,
          permissions: 12,
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
          permissions: 12,
          organId: executiveTeamId,
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
