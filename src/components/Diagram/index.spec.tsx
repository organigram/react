import { Organigram } from '@organigram/js'
import { render } from 'vitest-browser-react'
import { test, expect } from 'vitest'

import { Diagram } from '.'
import Wrapper from '../../../test/Wrapper'

test('Mount', async () => {
  const organigram = new Organigram()
  const { getByText } = await render(
    <Diagram
      {...{
        organigram,
        style: {
          height: '100vh'
        },
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
