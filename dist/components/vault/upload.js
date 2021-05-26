import React from 'react';
import { useVault } from "../../contexts/vault";
import { useIPFS } from "../../contexts/ipfs";
import { EMPTY_CID } from '@organigram/client-js';
export const Upload = ({
  cid,
  onCID,
  label = "Attach file"
}) => {
  const [modalShown, setModalShown] = React.useState(false);

  const toggleModal = () => setModalShown(ms => !ms);

  const handleCID = s => {
    setModalShown(false);
    if (s && onCID) onCID(s);
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: toggleModal
  }, `${label}`), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleCID(EMPTY_CID),
    className: "btn btn-primary ml-2"
  }, "Leave empty"), modalShown && /*#__PURE__*/React.createElement("div", {
    className: "card card-body bg-info"
  }, /*#__PURE__*/React.createElement(CIDInput, {
    cid: cid,
    onSave: c => handleCID(c)
  }), /*#__PURE__*/React.createElement("hr", {
    className: "my-2"
  }), /*#__PURE__*/React.createElement(PinSelect, {
    cid: cid,
    onSelect: c => handleCID(c)
  }), /*#__PURE__*/React.createElement("hr", {
    className: "my-2"
  }), /*#__PURE__*/React.createElement(FileUpload, {
    onUpload: c => handleCID(c)
  })));
};
export default Upload;
/**
 * Text input of an IPFS CID.
 * @param {(cid:CID|null) => void} onSave 
 */

export const CIDInput = ({
  cid,
  onSave
}) => {
  return /*#__PURE__*/React.createElement("form", {
    className: "form row my-2",
    onSubmit: e => {
      e.preventDefault();
      if (e.target.cid.value) onSave(`${e.target.cid.value}`);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "cid",
    className: "form-control",
    placeholder: "IPFS CID...",
    defaultValue: cid || ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-auto"
  }, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, "Save")));
};
/**
 * Select IPFS CID from local pins.
 * @param {(cid:CID|null) => void} onSelect 
 */

export const PinSelect = ({
  cid,
  onSelect
}) => {
  const {
    ipfs
  } = useIPFS();
  const [pins, setPins] = React.useState();
  React.useEffect(() => {
    if (ipfs) {
      ;

      (async () => {
        const _pins = [];

        for await (const _pin of ipfs.pin.ls()) {
          _pins.push(_pin);
        }

        setPins(_pins);
      })();
    }
  }, [ipfs]);
  return /*#__PURE__*/React.createElement("form", {
    className: "form row my-2",
    onSubmit: e => {
      e.preventDefault();
      if (e.target.cid.value) onSelect(`${e.target.cid.value}`);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("select", {
    name: "cid",
    className: "form-control",
    defaultValue: `${cid}`
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "-- Select a local pin"), pins && pins.map(p => /*#__PURE__*/React.createElement("option", {
    key: `${p.cid}`,
    value: `${p.cid}`
  }, `${p.cid}`)))), /*#__PURE__*/React.createElement("div", {
    className: "col-auto"
  }, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, "Select")));
};
/**
 * Upload file, encrypt it, generate a key ref, pin key ref and encrypted file.
 * @param {(cid:CID|null) => void} onUpload 
 */

export const FileUpload = ({
  onUpload
}) => {
  const {
    key,
    keyUploaded,
    addFile,
    createKey
  } = useVault();

  if (!key || !keyUploaded) {
    return /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        ;

        (async () => {
          let _key = key;
          let _keyUploaded = keyUploaded;
          if (!_key && confirm("An encryption key is necessary before any upload. Would you like to generate it now?")) _key = await createKey(true);
          if (_key && !_keyUploaded && confirm("To be able to decrypt your own files after your current session, or share these files securely with other accounts, you need to upload your encryption keys. Would you like to upload your keys to our keyserver contract now?")) _keyUploaded = await deployKey(_key);
        })();
      },
      className: "btn btn-primary"
    }, "Set up uploads");
  }

  return /*#__PURE__*/React.createElement("form", {
    className: "form row g-0 my-2",
    onSubmit: e => {
      e.preventDefault();
      const fileElt = e.target.file;
      if (
      /*!!e.target.consent.checked && */
      fileElt.files[0]) addFile(fileElt.files[0]).catch(error => console.error("Data not uploaded.", error.message)).then(cid => onUpload(cid));
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("input", {
    type: "file",
    name: "file",
    className: "form-control"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-auto"
  }, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, "Add file")));
};