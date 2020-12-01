import React from 'react'
import { useOrgan, withOrganProvider } from "../../contexts/organ"

export const Organ = props => {
    const { organ, loading, error } = useOrgan()
    return (
        <div {...props}>
            {loading && <p>Loading organ...</p>}
            {error && <p>Error: <pre>{JSON.stringify(error, null, 2)}</pre></p>}
            {organ && <pre>{JSON.stringify({
                ...organ,
                metadata: {
                    ...organ.metadata,
                    cid: organ.metadata.cid.toString(),
                    url: `https://ipfs.io/ipfs/${organ.metadata.cid.toV0()}`
                },
                entries: organ.entries.map(e => ({
                    ...e,
                    cid: e.cid.toString(),
                    url: `https://ipfs.io/ipfs/${e.cid.toV0()}`
                }))
            }, null, 2)}</pre>}
        </div>
    )
}

export default withOrganProvider(Organ)