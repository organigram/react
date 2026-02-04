import React from 'react'
import { createRoot } from 'react-dom/client'
import { Organigram } from '@organigram/js'

import { Diagram } from './src'
import Wrapper from './test/Wrapper'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Wrapper>
      <Diagram
        {...{
          organigram: new Organigram(), // Creates a default organigram. See options for more customization.
          style: {
            height: '100vh'
          },
          onClickAsset: () => {},
          onClickOrgan: () => {},
          onClickProcedure: () => {}
        }}
      />
    </Wrapper>
  </React.StrictMode>
)
