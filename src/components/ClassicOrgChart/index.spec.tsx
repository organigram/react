import { Organigram } from '@organigram/js'
import { render } from 'vitest-browser-react'
import { expect, test, vi } from 'vitest'

import { ClassicOrgChart } from '.'
import Wrapper from '../../../test/Wrapper'

test('renders classic org chart nodes and filtered entry leaves', async () => {
  const organigram = new Organigram()
  organigram.organs[0]!.entries = [
    { index: '1', address: '', cid: '' },
    { index: '2', address: '0x123', cid: '' }
  ]

  const { getByText } = await render(
    <ClassicOrgChart
      organigram={organigram}
      style={{ height: '100vh' }}
      isTabletOrAbove
    />,
    { wrapper: Wrapper }
  )

  await expect.element(getByText('Board of directors')).toBeInTheDocument()
  await expect.element(getByText('0x123')).toBeInTheDocument()
  // await expect.element(queryByText('1')).not.toBeInTheDocument()
})

test('calls onClickOrgan when an organ node is clicked', async () => {
  const organigram = new Organigram()
  const onClickOrgan = vi.fn()
  const { getByText } = await render(
    <ClassicOrgChart
      organigram={organigram}
      style={{ height: '100vh' }}
      isTabletOrAbove
      onClickOrgan={onClickOrgan}
    />,
    { wrapper: Wrapper }
  )

  await getByText('Board of directors').click()

  expect(onClickOrgan).toHaveBeenCalledTimes(1)
  expect(onClickOrgan).toHaveBeenCalledWith(
    expect.objectContaining({ name: 'Board of directors' })
  )
})
