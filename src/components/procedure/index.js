import React from 'react'
import { useProcedure, withProcedureProvider } from "../../contexts/procedure"
import { ProcedureMoves } from './moves'

export const Procedure = props => {
    const { procedure, loading, error } = useProcedure()
    const [ProcedureComponent, setProcedureComponent] = React.useState()

    React.useEffect(async () => {
        if (procedure.type)
            switch(procedure.type) {
                case '0xc5f28e49': // Nomination.
                    setProcedureComponent(React.lazy(() => import('./nomination')))
                    break
                case '0xc9d27afe': // Vote.
                    setProcedureComponent(React.lazy(() => import('./vote')))
                    break
                default:
                    console.log('procedure.type', procedure.type)
                    break
            }
    }, [procedure.type])

    if (!procedure) {
        return loading ?
            (props.loading || <p>Loading.</p>)
            : (props.not_found || <p>Procedure not found.</p>)
    }

    return (
        <>
            {loading && <p>Loading.</p>}
            {error && <pre>Error: {JSON.stringify(error, null, 2)}</pre>}
            {procedure && procedure.type && ProcedureComponent && (
                <React.Suspense fallback={<p>Loading...</p>}>
                    <ProcedureComponent {...props} />
                </React.Suspense>
            )}
            {procedure && procedure.type && (
                <>
                    <ProcedureMoves />
                </>
            )}
        </>
    )
}

export default withProcedureProvider(Procedure)