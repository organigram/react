import { render } from 'vitest-browser-react'
import { test, expect } from 'vitest'

import DemoApp from '../../DemoApp'

test('Mount', async () => {
  const { getByText } = await render(<DemoApp />)
  await expect.element(getByText('Board of directors')).toBeInTheDocument()
})
