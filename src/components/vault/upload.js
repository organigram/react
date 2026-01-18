import React from 'react'
import { useVault } from '../../contexts/vault'
import { useIPFS } from '../../contexts/ipfs'
import { EMPTY_CID } from '@organigram/js'

export const Upload = ({ cid, onCID, label = 'Attach file' }) => {
    const [modalShown, setModalShown] = React.useState(false)
    const toggleModal = () => setModalShown(ms => !ms)

    const handleCID = s => {
        setModalShown(false)
        if (s && onCID) { onCID(s) }
    }

    return (
        <>
            <button className="btn btn-primary" onClick={toggleModal}>{`${label}`}</button>
            <button onClick={() => handleCID(EMPTY_CID)} className="btn btn-primary ml-2">Leave empty</button>
            {modalShown && (
                <div className="card card-body bg-info">
                    <CIDInput cid={cid} onSave={c => handleCID(c)} />
                    <hr className="my-2" />
                    <PinSelect cid={cid} onSelect={c => handleCID(c)} />
                    <hr className="my-2" />
                    <FileUpload onUpload={c => handleCID(c)} />
                </div>
            )}
        </>
    )
}

export default Upload

/**
 * Text input of an IPFS CID.
 * @param {(cid:CID|null) => void} onSave
 */
export const CIDInput = ({ cid, onSave }) => {
    return (
        <form className="form row my-2"
            onSubmit={e => {
                e.preventDefault()
                if (e.target.cid.value) { onSave(`${e.target.cid.value}`) }
            }}
        >
            <div className="col">
                <input type="text" name="cid" className="form-control" placeholder="IPFS CID..." defaultValue={cid || ''} />
            </div>
            <div className="col-auto">
                <button type="submit" className="btn btn-primary">Save</button>
            </div>
        </form>
    )
}

/**
 * Select IPFS CID from local pins.
 * @param {(cid:CID|null) => void} onSelect
 */
export const PinSelect = ({ cid, onSelect }) => {
    const { ipfs } = useIPFS()
    const [pins, setPins] = React.useState()

    React.useEffect(() => {
        if (ipfs) {
            ;(async () => {
                const _pins = []
                for await (const _pin of ipfs.pin.ls()) {
                    _pins.push(_pin)
                }
                setPins(_pins)
            })()
        }
    }, [ipfs])

    return (
        <form className="form row my-2"
            onSubmit={e => {
                e.preventDefault()
                if (e.target.cid.value) { onSelect(`${e.target.cid.value}`) }
            }}
        >
            <div className="col">
                <select name="cid" className="form-control" defaultValue={`${cid}`}>
                    <option value="">-- Select a local pin</option>
                    {
                        pins && pins.map(p => (
                            <option key={`${p.cid}`} value={`${p.cid}`}>{`${p.cid}`}</option>
                        ))
                    }
                </select>
            </div>
            <div className="col-auto">
                <button type="submit" className="btn btn-primary">Select</button>
            </div>
        </form>
    )
}

/**
 * Upload file, encrypt it, generate a key ref, pin key ref and encrypted file.
 * @param {(cid:CID|null) => void} onUpload
 */
export const FileUpload = ({ onUpload }) => {
    const { key, keyUploaded, addFile, createKey } = useVault()
    if (!key || !keyUploaded) {
        return (
            <button onClick={() => {
                ;(async () => {
                    let _key = key
                    let _keyUploaded = keyUploaded
                    if (!_key && confirm('An encryption key is necessary before any upload. Would you like to generate it now?')) { _key = await createKey(true) }
                    if (_key && !_keyUploaded && confirm('To be able to decrypt your own files after your current session, or share these files securely with other accounts, you need to upload your encryption keys. Would you like to upload your keys to our keyserver contract now?')) { _keyUploaded = await deployKey(_key) }
                })()
            }} className="btn btn-primary">Set up uploads</button>
        )
    }
    return (
        <form className="form row g-0 my-2"
            onSubmit={e => {
                e.preventDefault()
                const fileElt = e.target.file
                if (/*! !e.target.consent.checked && */fileElt.files[0]) {
 addFile(fileElt.files[0])
                    .catch(error => console.error('Data not uploaded.', error.message))
                    .then(cid => onUpload(cid))
}
            }}
        >
            <div className="col">
                <input type="file" name="file" className="form-control" />
                {/* <div className="form-check">
                    <label className="form-check-label">
                        <input type="checkbox" name="consent" className="form-check-input" /> I understand that my file will be encrypted and stored on IPFS, a potentially permanent distributed storage network, and that modern encryption could be broken one day.
                    </label>
                </div> */}
            </div>
            <div className="col-auto">
                <button type="submit" className="btn btn-primary">Add file</button>
            </div>
        </form>
    )
}
