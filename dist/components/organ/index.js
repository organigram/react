import React from 'react';
import { useOrgan, withOrganProvider } from "../../contexts/organ";
export const Organ = props => {
  const {
    organ,
    loading,
    error
  } = useOrgan();
  return /*#__PURE__*/React.createElement("div", props, loading && /*#__PURE__*/React.createElement("p", null, "Loading organ..."), error && /*#__PURE__*/React.createElement("p", null, "Error: ", /*#__PURE__*/React.createElement("pre", null, JSON.stringify(error, null, 2))), organ && /*#__PURE__*/React.createElement("pre", null, JSON.stringify({ ...organ,
    metadata: { ...organ.metadata,
      cid: organ.metadata.cid.toString(),
      url: `https://ipfs.io/ipfs/${organ.metadata.cid.toV0()}`
    },
    entries: organ.entries.map(e => ({ ...e,
      cid: e.cid.toString(),
      url: `https://ipfs.io/ipfs/${e.cid.toV0()}`
    }))
  }, null, 2)));
};
export default withOrganProvider(Organ);