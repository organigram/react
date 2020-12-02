import React from 'react';
import { useOrgan, withOrganProvider } from "../../contexts/organ";
export const Organ = props => {
  const {
    organ,
    loading,
    error
  } = useOrgan();
  let metadata = null,
      entries = [];

  if (organ) {
    if (organ.metadata && organ.metadata.cid) metadata = { ...organ.metadata,
      cid: `${organ.metadata.cid}`,
      url: `https://ipfs.io/ipfs/${organ.metadata.cid}`
    };
    if (organ.entries) entries = organ.entries.map(e => {
      return e.cid ? { ...e,
        cid: `${e.cid}`,
        url: `https://ipfs.io/ipfs/${e.cid}`
      } : e;
    });
  }

  return /*#__PURE__*/React.createElement("div", props, loading && /*#__PURE__*/React.createElement("p", null, "Loading organ..."), error && /*#__PURE__*/React.createElement("pre", null, "Error: ", JSON.stringify(error, null, 2)), organ && /*#__PURE__*/React.createElement("pre", null, JSON.stringify({ ...organ,
    metadata,
    entries
  }, null, 2)));
};
export default withOrganProvider(Organ);