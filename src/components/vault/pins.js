import React from 'react'
import { useIPFS } from '../../contexts/ipfs'
import File from './file'

export const VaultPins = () => {
    const { ipfs } = useIPFS()
    const [cids, setCids] = React.useState([])
    const addCid = c => setCids(cs => [...new Set([...cs, c])])

    React.useEffect(() => {
        ;(async () => {
            if (ipfs) {
                for await (const { cid } of ipfs.pin.ls()) {
                    addCid(cid)
                }
            } else {
                console.error('IPFS not started.')
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
