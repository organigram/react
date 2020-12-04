import React from 'react'
import { useProcedure } from '../../../contexts/procedure'

export const Nomination = () => {
    const { procedure } = useProcedure()
    return procedure && procedure.data ? (
        <div className="procedure-nomination">
            <h4>Nomination</h4>
            <div>
                Nominaters Organ: <code>{procedure.data.nominatersOrgan}</code>
            </div>
        </div>
    ) : <></>
}

export default Nomination