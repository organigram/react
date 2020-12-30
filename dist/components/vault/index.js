import React from 'react';
import { useVault } from '../../contexts/vault';
import { useWeb3 } from '../../contexts/web3';
import { useIPFS } from '../../contexts/ipfs';
import File from './file';
export const Vault = () => {
  const {
    account
  } = useWeb3();
  const {
    ipfs
  } = useIPFS();
  const {
    key,
    keyserver,
    keyUploaded,
    createKey,
    _deployKeyserver,
    _createSignature,
    loadKey,
    uploadKey,
    addFile,
    getFiles
  } = useVault();
  const [showPins, setShowPins] = React.useState(false);

  const togglePins = () => setShowPins(sp => !sp);

  const [cids, setCids] = React.useState([]);

  const addCid = c => setCids(cs => cs.find(csc => `${csc}` === `${c}`) ? cs : [...cs, c]);

  React.useEffect(() => {
    if (account && keyserver) {
      setCids([]);
      setShowPins(false);
    }
  }, [account, keyserver]);
  const VaultPins = /*#__PURE__*/React.lazy(() => import('./pins'));
  return /*#__PURE__*/React.createElement(React.Fragment, null, key && (keyUploaded ? /*#__PURE__*/React.createElement("p", {
    className: "text-success"
  }, "Encryption key generated and ready to use.") : /*#__PURE__*/React.createElement("p", {
    className: "text-warning"
  }, "Encryption key generated but not uploaded.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      _createSignature().then(k => k && console.log("Signature generated, encryption key can be unlocked.")).catch(error => console.warn(error.message));
    },
    className: "btn btn-primary mr-1 mb-2"
  }, "Unlock key"), !keyserver && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      _deployKeyserver().then(k => k && console.log("Keyserver deployed", k.address)).catch(error => console.warn(error.message));
    },
    className: "btn btn-primary mr-1 mb-2"
  }, "Deploy keyserver"), !key && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      createKey(true).then(k => console.log("key saved", k)).catch(error => console.error("Key generation error.", error.message));
    },
    className: "btn btn-primary mr-1 mb-2"
  }, "Create key"), !key && keyUploaded && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      loadKey(true).then(k => console.log("key loaded", k)).catch(error => console.error("Key not found.", error.message));
    },
    className: "btn btn-primary mr-1 mb-2"
  }, "Load key"), key && !keyUploaded && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      uploadKey().then(k => console.log("key uploaded", k)).catch(error => console.error("Key not uploaded.", error.message));
    },
    className: "btn btn-info mr-1 mb-2"
  }, "Upload key")), key && /*#__PURE__*/React.createElement("form", {
    className: "form row g-0 my-2",
    onSubmit: e => {
      e.preventDefault();
      const fileElt = e.target.file;
      if (fileElt.files[0]) addFile(fileElt.files[0]).catch(error => console.error("Data not uploaded.", error.message)).then(cid => addCid(cid));
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("input", {
    type: "file",
    name: "file",
    className: "form-control"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-auto"
  }, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, "Add file"))), key && /*#__PURE__*/React.createElement("form", {
    className: "form row g-0 my-2",
    onSubmit: e => {
      e.preventDefault();
      if (e.target.cid.value) addCid(e.target.cid.value);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "cid",
    placeholder: "IPFS CID",
    className: "form-control"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-auto"
  }, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, "Load file"))), /*#__PURE__*/React.createElement("hr", {
    className: "my-3"
  }), /*#__PURE__*/React.createElement("div", {
    className: "my-3"
  }, /*#__PURE__*/React.createElement("h5", null, "Files"), /*#__PURE__*/React.createElement("ul", {
    className: "list-unstyled"
  }, cids && cids.map(cid => /*#__PURE__*/React.createElement("li", {
    key: cid,
    className: "list-item"
  }, /*#__PURE__*/React.createElement(File, {
    cid: cid
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "my-3"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => togglePins()
  }, "Toggle Pins")), showPins && /*#__PURE__*/React.createElement(React.Suspense, {
    fallback: "Loading..."
  }, /*#__PURE__*/React.createElement(VaultPins, null)));
};
export default Vault;