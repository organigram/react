import React from 'react'
import { useIPFS } from '../../contexts/ipfs'
import File from './file'

export const VaultPins = () => {
    const { ipfs } = useIPFS()
    const [cids, setCids] = React.useState([])
    const addCid = c => setCids(cs => cs.find(csc => `${csc}` === `${c}`) ? cs : [...cs, c])

    React.useEffect(() => {
        ;(async () => {
            if (ipfs) {
                console.log("- Pins load started.")
                for await (const { cid } of ipfs.pin.ls()) {
                    console.log("Found cid", `${cid}`)
                    addCid(cid)
                }
            } else {
                console.log("No IPFS...")
            }
        })()
    }, [ipfs])

    return (
        <ul className="list-unstyled">
            {cids && cids.map(cid => (
                <li key={`${cid}`} className="mb-1">
                    <File cid={cid} />
                </li>
            ))}
        </ul>
    )
}

export default VaultPins