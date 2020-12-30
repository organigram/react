import React from 'react'
import { useVault } from '../../contexts/vault'

export const File = ({ cid }) => {
    const { getFiles, getFilesMetadata } = useVault()
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)
    const [metadata, setMetadata] = React.useState(null)
    const [files, setFiles] = React.useState(null)
    const [filesUrl, setFilesUrl] = React.useState(null)

    const decrypt = async () => {
        if (!metadata)
            throw new Error("File not found.")
        setLoading(true)
        getFiles(cid)
        .then(files => {
            setFiles(files)
            setFilesUrl(null)
        })
        .catch(error => {
            setError(error.message)
        })
        .finally(() => setLoading(false))
    }

    React.useEffect(() => {
        setLoading(true)
        getFilesMetadata(cid)
        .then(filesMetadata => {
            if (filesMetadata[0])
                setMetadata(filesMetadata[0])
        })
        .catch(error => {
            setError(error.message)
        })
        .finally(() => setLoading(false))
    }, [])

    React.useEffect(() => {
        if (files)
            setFilesUrl(files.map(file => file ? window.URL.createObjectURL(file) : ""))
        return () => {
            if (filesUrl) {
                filesUrl.forEach(fileUrl => fileUrl && window.URL.revokeObjectURL(fileUrl))
                setFilesUrl(null)
            }
        }
    }, [files])

    return (
        <div className="card card-body bg-secondary">
            <strong>{`${cid}`}</strong>
            {loading && <p><em className="text-info">Loading...</em></p>}
            {error && <div><em className="text-danger">Error : {error}</em></div>}
            {metadata && (
                <pre>{JSON.stringify(metadata, null, 2)}</pre>
            )}
            {metadata && !files && (
                <button onClick={() => decrypt()} className="btn btn-primary">Decrypt</button>
            )}
            {files && filesUrl && (
                files.map((file, i) => {
                    const fileUrl = filesUrl[i]
                    return (
                        <div className="file" key={`file-${i}`}>
                            <a href={`${fileUrl}`} className="btn btn-danger" target="_blank">Download</a>
                        </div>
                    )
                })
            )}
        </div>
    )
}

export default File