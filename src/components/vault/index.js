import React from 'react'
import { useVault } from '../../contexts/vault'
import { useWeb3 } from '../../contexts/web3'
import { useIPFS } from '../../contexts/ipfs'
import File from './file'

export const Vault = () => {
    const { account } = useWeb3()
    const { ipfs } = useIPFS()
    const {
        key, keyserver, keyUploaded,
        createKey, _deployKeyserver, _createSignature,
        loadKey, uploadKey,
        addFile, getFiles
    } = useVault()
    const [showPins, setShowPins] = React.useState(false)
    const togglePins = () => setShowPins(sp => !sp)
    const [cids, setCids] = React.useState([])
    const addCid = c => setCids(cs => cs.find(csc => `${csc}` === `${c}`) ? cs : [...cs, c])

    React.useEffect(() => {
        if (account && keyserver) {
            setCids([])
            setShowPins(false)
        }
    }, [account, keyserver])

    const VaultPins = React.lazy(() => import('./pins'))

    return (
        <>
            {key && (
                keyUploaded
                    ? <p className="text-success">Encryption key generated and ready to use.</p>
                    : <p className="text-warning">Encryption key generated but not uploaded.</p>
            )}
            <div>
                <button onClick={() => {
                    _createSignature()
                    .then(k => k && console.log("Signature generated, encryption key can be unlocked."))
                    .catch(error => console.warn(error.message))
                }} className="btn btn-primary mr-1 mb-2">
                    Unlock key
                </button>
                {!keyserver && (
                    <button onClick={() => {
                        _deployKeyserver()
                        .then(k => k && console.log("Keyserver deployed", k.address))
                        .catch(error => console.warn(error.message))
                    }} className="btn btn-primary mr-1 mb-2">
                        Deploy keyserver
                    </button>
                )}
                {!key && (
                    <button onClick={() => {
                        createKey(true)
                        .then(k => console.log("key saved", k))
                        .catch(error => console.error("Key generation error.", error.message))
                    }} className="btn btn-primary mr-1 mb-2">
                        Create key
                    </button>
                )}
                {!key && keyUploaded && (
                    <button onClick={() => {
                        loadKey(true)
                        .then(k => console.log("key loaded", k))
                        .catch(error => console.error("Key not found.", error.message))
                    }} className="btn btn-primary mr-1 mb-2">
                        Load key
                    </button>
                )}
                {key && !keyUploaded && (
                    <button onClick={() => {
                        uploadKey()
                        .then(k => console.log("key uploaded", k))
                        .catch(error => console.error("Key not uploaded.", error.message))
                    }} className="btn btn-info mr-1 mb-2">
                        Upload key
                    </button>
                )}
            </div>
            {key && (
                <form className="form row g-0 my-2"
                    onSubmit={e => {
                        e.preventDefault()
                        const fileElt = e.target.file
                        if (fileElt.files[0])
                            addFile(fileElt.files[0])
                            .catch(error => console.error("Data not uploaded.", error.message))
                            .then(cid => addCid(cid))
                    }}
                >
                    <div className="col-6">
                        <input type="file" name="file" className="form-control" />
                    </div>
                    <div className="col-auto">
                        <button type="submit" className="btn btn-primary">Add file</button>
                    </div>
                </form>
            )}
            {key && (
                <form className="form row g-0 my-2"
                    onSubmit={e => {
                        e.preventDefault()
                        if (e.target.cid.value)
                            addCid(e.target.cid.value)
                    }}
                >
                    <div className="col-6">
                        <input type="text" name="cid" placeholder="IPFS CID" className="form-control" />
                    </div>
                    <div className="col-auto">
                        <button type="submit" className="btn btn-primary">Load file</button>
                    </div>
                </form>
            )}
            <hr className="my-3" />
            <div className="my-3">
                <h5>Files</h5>
                <ul className="list-unstyled">
                    {cids && cids.map(cid => (
                        <li key={cid} className="list-item">
                            <File cid={cid} />
                        </li>
                    ))}
                </ul>
            </div>
            <div className="my-3">
                <button className="btn btn-primary" onClick={() => togglePins()}>
                    Toggle Pins
                </button>
            </div>
            {showPins && (
                <React.Suspense fallback={"Loading..."}>
                    <VaultPins />
                </React.Suspense>
            )}
        </>
    )
}

export default Vault