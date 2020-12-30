import React from 'react';
import { useVault } from '../../contexts/vault';
export const File = ({
  cid
}) => {
  const {
    getFiles,
    getFilesMetadata
  } = useVault();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [metadata, setMetadata] = React.useState(null);
  const [files, setFiles] = React.useState(null);
  const [filesUrl, setFilesUrl] = React.useState(null);

  const decrypt = async () => {
    if (!metadata) throw new Error("File not found.");
    setLoading(true);
    getFiles(cid).then(files => {
      setFiles(files);
      setFilesUrl(null);
    }).catch(error => {
      setError(error.message);
    }).finally(() => setLoading(false));
  };

  React.useEffect(() => {
    setLoading(true);
    getFilesMetadata(cid).then(filesMetadata => {
      if (filesMetadata[0]) setMetadata(filesMetadata[0]);
    }).catch(error => {
      setError(error.message);
    }).finally(() => setLoading(false));
  }, []);
  React.useEffect(() => {
    if (files) setFilesUrl(files.map(file => file ? window.URL.createObjectURL(file) : ""));
    return () => {
      if (filesUrl) {
        filesUrl.forEach(fileUrl => fileUrl && window.URL.revokeObjectURL(fileUrl));
        setFilesUrl(null);
      }
    };
  }, [files]);
  return /*#__PURE__*/React.createElement("div", {
    className: "card card-body bg-secondary"
  }, /*#__PURE__*/React.createElement("strong", null, `${cid}`), loading && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("em", {
    className: "text-info"
  }, "Loading...")), error && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("em", {
    className: "text-danger"
  }, "Error : ", error)), metadata && /*#__PURE__*/React.createElement("pre", null, JSON.stringify(metadata, null, 2)), metadata && !files && /*#__PURE__*/React.createElement("button", {
    onClick: () => decrypt(),
    className: "btn btn-primary"
  }, "Decrypt"), files && filesUrl && files.map((file, i) => {
    const fileUrl = filesUrl[i];
    return /*#__PURE__*/React.createElement("div", {
      className: "file",
      key: `file-${i}`
    }, /*#__PURE__*/React.createElement("a", {
      href: `${fileUrl}`,
      className: "btn btn-danger",
      target: "_blank"
    }, "Download"));
  }));
};
export default File;