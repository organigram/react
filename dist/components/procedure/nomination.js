import React from 'react';
import { useProcedure } from "../../contexts/procedure";
export const Nomination = props => {
  const {
    procedure
  } = useProcedure();
  return procedure && /*#__PURE__*/React.createElement("div", {
    className: "procedure procedure-nomination"
  }, /*#__PURE__*/React.createElement("p", null, "Nomination"), /*#__PURE__*/React.createElement("pre", null, JSON.stringify({ ...procedure,
    metadata: procedure.metadata && procedure.metadata.cid ? { ...procedure.metadata,
      cid: `${procedure.metadata.cid}`,
      url: `https://ipfs.io/ipfs/${procedure.metadata.cid}`
    } : procedure.metadata
  }, 0, 2)), props && props.children);
};
export default Nomination;