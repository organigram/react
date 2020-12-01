import React from 'react'
import { useProcedure } from "../../contexts/procedure"

export const Nomination = props => {
    const { procedure } = useProcedure()
    return procedure && (
        <div className="procedure procedure-nomination">
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

export default Nomination