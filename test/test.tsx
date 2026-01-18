import React from 'react'
import { render } from '@testing-library/react'
import { OrganigramClientProvider } from '../src'

describe('OrganigramClientProvider', () => {
  test('Mount', () => {
    const { container } = render(
      <OrganigramClientProvider platforms={[]} />
    )
  })
})
