import React from 'react'
import { useProcedure } from "../../contexts/procedure"

export const Vote = props => {
    const { procedure } = useProcedure()
    return procedure && (
        <div className="procedure procedure-vote">
            <pre>{JSON.stringify({
                ...procedure,
                metadata: {
                    ...procedure.metadata,
                    cid: procedure.metadata.cid.toString(),
                    url: `https://ipfs.io/ipfs/${procedure.metadata.cid.toString()}`
                }
            }, 0, 2)}</pre>
            {props && props.children}
        </div>
    )
}

export default Vote