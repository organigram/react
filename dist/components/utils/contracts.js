export const ContractsAlert = () => {
  const {
    contracts,
    libraries,
    registerLibrary,
    deployLibrary
  } = useContracts();
  return /*#__PURE__*/React.createElement("pre", null, JSON.stringify({
    contracts,
    libraries
  }, null, 2));
};