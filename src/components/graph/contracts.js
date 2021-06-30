import React from 'react'
import {
    Organ as OrganClass,
    ProcedureNomination as ProcedureNominationClass,
    ProcedureVote as ProcedureVoteClass,
    EMPTY_CID
} from '@organigram/client-js'
import { useGraph } from '../../contexts/graph'
import { usePlatform } from '../../contexts/platform'

export const GraphContracts = () => {
    const { graph, addContracts, removeContracts } = useGraph()
    const { manager, createOrgan, createProcedure } = usePlatform()
    const contracts = !graph ? [] : [
        ...graph.organs.map(({ address }) => address),
        ...graph.procedures.map(({ address }) => address)
    ]
    return (
        <>
          <h3>Contracts</h3>
          {contracts && contracts.length > 0 && (
            <ul className="list-unstyled mb-2">
              {[...new Set(contracts)].map(address => (
                <li key={address} className="list-item">
                  {address} <span onClick={() => removeContracts([address])} className="text-danger">x</span>
                </li>
              ))}
            </ul>
          )}
          <form className="form row g-3 mb-2" onSubmit={e =>{
            e.preventDefault()
            addContracts([e.currentTarget.ethereum.value])
          }}>
            <div className="col-6">
              <input type="text" name="ethereum" className="form-control" placeholder="Ethereum address" />
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary">Add Contract</button>
            </div>
          </form>
          <div className="alert alert-dark mt-2 mb-0">
            <button className="btn btn-primary mr-1" onClick={async () => 
              createOrgan(EMPTY_CID)
                .then(o => addContracts([o.address]))
                .catch(error => console.error(error.message))
            }>Create organ</button>
            {manager?.procedureTypes?.map(procedureType => (
              <button key={procedureType.key} className="btn btn-primary mx-1" onClick={async () => 
                manager?.createProcedure(
                  procedureType.address,
                  EMPTY_CID,
                  manager.organs && manager.organs[0],
                  manager.organs && manager.organs[0],
                  manager.organs && manager.organs[0],
                  false,
                  ...(procedureType.key === 'vote' ? [
                    "1", // quorumSize: string,
                    "8", // voteDuration: string,
                    "1"  // majoritySize: string
                  ] : [])
                )
                  .then(o => addContracts([o.address]))
                  .catch(error => console.error(error.message))
              }>Create {procedureType.label}</button>
            ))}
            <button className="btn btn-primary ml-1" onClick={async () => 
              ProcedureVoteClass.deploy(EMPTY_CID)
                .then(o => addContracts([o.address]))
                .catch(error => console.error(error.message))
            }>Deploy vote</button>
          </div>
        </>
    )
}

export default GraphContracts

export const ContractSelector = ({ contracts, onSelect }) => {
    const handleChange = (event) => {
        const contract = contracts.find(c => c.address === event.target.value)
        if (contract) onSelect(contract)
    }
    return (
        <select onChange={handleChange} className="form-control">
            <option value="">-- Select a contract</option>
            {contracts.map(c =>
                <option key={c.address} value={c.address}>{c.address}</option>
            )}
        </select>
    )
}