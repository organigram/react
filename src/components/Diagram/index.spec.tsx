import { render } from 'vitest-browser-react'
import { test, expect } from 'vitest'

import { Diagram, DiagramOrganigram } from '.'
import Wrapper from '../../../test/Wrapper'
import { exampleOrganigram } from '../../../test/exampleOrganigram'

test('Mount', async () => {
  const { getByText } = await render(
    <Diagram
      {...{
        direction: 'TB',
        organigram: exampleOrganigram as DiagramOrganigram,
        style: {
          height: '100vh'
        },
        controls: true,
        onClickAsset: () => {},
        onClickOrgan: () => {},
        onClickProcedure: () => {}
      }}
    />,
    {
      wrapper: Wrapper
    }
  )
  await expect.element(getByText('Board of directors')).toBeInTheDocument()
})
