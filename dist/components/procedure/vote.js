import React from 'react';
import { useProcedure } from "../../contexts/procedure";
export const Vote = props => {
  const {
    procedure
  } = useProcedure();
  return procedure && /*#__PURE__*/React.createElement("div", {
    className: "procedure procedure-vote"
  }, /*#__PURE__*/React.createElement("p", null, "Vote"), /*#__PURE__*/React.createElement("pre", null, JSON.stringify({ ...procedure,
    metadata: { ...procedure.metadata,
      cid: `${procedure.metadata.cid}`,
      url: `https://ipfs.io/ipfs/${procedure.metadata.cid}`
    },
    moves: procedure.moves.map(m => ({ ...m,
      metadata: m.metadata && m.metadata.cid ? { ...m.metadata,
        cid: `${m.metadata.cid}`,
        url: `https://ipfs.io/ipfs/${m.metadata.cid}`
      } : m.metadata
    }))
  }, 0, 2)), props && props.children);
};
export default Vote;