import React from 'react'
import { useProcedure, withProcedureProvider } from "../../contexts/procedure"

export const Procedure = props => {
    const { procedure, loading, error } = useProcedure()
    const [ProcedureComponent, setProcedureComponent] = React.useState(null)

    React.useEffect(async () => {
        if (!procedure)
            setProcedureComponent(null)
        else {
            let Component = null
            switch (procedure.type) {
                case 'nomination':
                    Component = React.lazy(() => import('./nomination'))
                    break
                case 'vote':
                    Component = React.lazy(() => import('./vote'))
                    break
                default:
                    // @todo : Dev only.
                    Component = componentProps => <pre>{JSON.stringify(componentProps, 0, 2)}</pre>
                    break
            }
            setProcedureComponent(Component)
        }
    }, [procedure])

    if (!procedure) {
        return loading ?
            (props.loading || <p>Loading.</p>)
            : (props.not_found || <p>Procedure not found.</p>)
    }

    return (
        <>
            {loading && <p>Loading.</p>}
            {error && <p>Error: {error.message}</p>}
            {procedure && ProcedureComponent && (
                <React.Suspense fallback={"Loading..."}>
                    <ProcedureComponent {...props} />
                </React.Suspense>
            )} 
        </>
    )
}

export default withProcedureProvider(Procedure)