import React from 'react';
import { useOrgan, withOrganProvider } from "../../contexts/organ";
export const Organ = props => {
  const {
    organ,
    loading,
    error
  } = useOrgan();
  let metadata = null,
      cid = null,
      entries = [];

  if (organ) {
    if (organ.metadata && organ.metadata.cid) {
      cid = organ.metadata.cid.toV0();
      metadata = { ...organ.metadata,
        cid,
        url: `https://ipfs.io/ipfs/${cid}`
      };
    }

    if (organ.entries) entries = organ.entries.map(e => {
      const entryCID = e.cid && e.cid.toV0();
      return e.cid ? { ...e,
        cid: entryCID,
        url: `https://ipfs.io/ipfs/${entryCID}`
      } : e;
    });
  }

  return /*#__PURE__*/React.createElement("div", props, loading && /*#__PURE__*/React.createElement("p", null, "Loading organ..."), error && /*#__PURE__*/React.createElement("p", null, "Error: ", /*#__PURE__*/React.createElement("pre", null, JSON.stringify(error, null, 2))), organ && /*#__PURE__*/React.createElement("pre", null, JSON.stringify({ ...organ,
    metadata,
    entries
  }, null, 2)));
};
export default withOrganProvider(Organ);