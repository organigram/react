import { RecoilRoot } from 'recoil'
import { render } from 'vitest-browser-react'
import { expect } from 'vitest'

import { Diagram, type DiagramOrganigram } from '.'

const exampleOrganigram = {
  id: null,
  name: 'Example',
  description: 'This is an example organigram.',
  organs: [
    {
      id: '1',
      name: 'Board of directors',
      description: '',
      cid: '',
      entries: []
    },
    {
      id: '2',
      name: 'Executive team',
      description: '',
      cid: '',
      address: '',
      entries: []
    }
  ],
  procedures: [
    {
      id: '1',
      name: 'Elect executive team',
      description:
        'This procedure does not have a description yet. You can edit it by clicking here.',
      cid: '',
      address: '',
      typeName: 'vote',
      data: null,
      sourceOrgans: [
        {
          organId: '1',
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
          organId: '2'
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

test('Mount', async () => {
  const { getByText } = await render(
    <RecoilRoot>
      <Diagram
        {...{
          direction: 'TB',
          organigram: exampleOrganigram as DiagramOrganigram,
          style: {
            height: '100vh'
          },
          controls: true
        }}
      />
    </RecoilRoot>
  )
  await expect.element(getByText('Board of directors')).toBeInTheDocument()
})
