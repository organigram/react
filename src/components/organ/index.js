import React from 'react'
import { useOrgan, withOrganProvider } from "../../contexts/organ"

export const Organ = props => {
    const { organ, loading, error } = useOrgan()

    let metadata = null, cid = null, entries = []
    if (organ) {
        if (organ.metadata && organ.metadata.cid) {
            cid = organ.metadata.cid.toV0()
            metadata = {
                ...organ.metadata,
                cid,
                url: `https://ipfs.io/ipfs/${cid}`
            }
        }
        if (organ.entries)
            entries = organ.entries.map(e => {
                const entryCID = e.cid && e.cid.toV0()
                return e.cid ? {
                    ...e,
                    cid: entryCID,
                    url: `https://ipfs.io/ipfs/${entryCID}`
                } : e
            })
    }
    return (
        <div {...props}>
            {loading && <p>Loading organ...</p>}
            {error && <p>Error: <pre>{JSON.stringify(error, null, 2)}</pre></p>}
            {organ && <pre>{JSON.stringify({ ...organ, metadata, entries }, null, 2)}</pre>}
        </div>
    )
}

export default withOrganProvider(Organ)