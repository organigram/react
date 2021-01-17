import React from 'react';
import { useIPFS } from '../../contexts/ipfs';
import File from './file';
export const VaultPins = () => {
  const {
    ipfs
  } = useIPFS();
  const [cids, setCids] = React.useState([]);

  const addCid = c => setCids(cs => cs.find(csc => `${csc}` === `${c}`) ? cs : [...cs, c]);

  React.useEffect(() => {
    ;

    (async () => {
      if (ipfs) {
        for await (const {
          cid
        } of ipfs.pin.ls()) {
          addCid(cid);
        }
      } else {
        console.error("IPFS not started.");
      }
    })();
  }, [ipfs]);
  return /*#__PURE__*/React.createElement("ul", {
    className: "list-unstyled"
  }, cids && cids.map(cid => /*#__PURE__*/React.createElement("li", {
    key: `${cid}`,
    className: "mb-1"
  }, /*#__PURE__*/React.createElement(File, {
    cid: cid
  }))));
};
export default VaultPins;