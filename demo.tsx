import React from 'react'
import { createRoot } from 'react-dom/client'

import { Diagram, DiagramOrganigram } from './src'
import Wrapper from './test/Wrapper'
import { exampleOrganigram } from './test/exampleOrganigram'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Wrapper>
      <Diagram
        {...{
          direction: 'TB',
          organigram: exampleOrganigram as unknown as DiagramOrganigram,
          style: {
            height: '100vh'
          },
          controls: true,
          onClickAsset: () => {},
          onClickOrgan: () => {},
          onClickProcedure: () => {}
        }}
      />
    </Wrapper>
  </React.StrictMode>
)
