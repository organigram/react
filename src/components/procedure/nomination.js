import React from 'react'
import { useProcedure } from "../../contexts/procedure"

export const Nomination = props => {
    const { procedure } = useProcedure()
    return procedure && (
        <div className="procedure procedure-nomination">
            <p>Nomination</p>
            <pre>{JSON.stringify({
                ...procedure,
                metadata: procedure.metadata && procedure.metadata.cid ? {
                    ...procedure.metadata,
                    cid: `${procedure.metadata.cid}`,
                    url: `https://ipfs.io/ipfs/${procedure.metadata.cid}`
                } : procedure.metadata,
                moves: procedure.moves.map(m => ({
                    ...m,
                    metadata: m.metadata && m.metadata.cid ? {
                        ...m.metadata,
                        cid: `${m.metadata.cid}`,
                        url: `https://ipfs.io/ipfs/${m.metadata.cid}`
                    } : m.metadata
                }))
            }, 0, 2)}</pre>
            {props && props.children}
        </div>
    )
}

export default Nomination