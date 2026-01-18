import React, { useState, useEffect } from 'react'
import { useWeb3 } from './web3'
import {
    openpgp,
    ipfs,
    generateSignature,
    generatePassword,
    _encryptMessagePGP,
    _decryptMessagePGP,
    generateKey,
    getAccount,
    Organ
} from '@organigram/js'
import { concat } from 'uint8arrays/concat'

export const VaultContext = React.createContext({
    key: null,
    keyserver: null,
    keyUploaded: false,
    hasSignature: false,
    _createSignature: null,
    _deleteSignature: null,
    createKey: null,
    loadKey: null,
    uploadKey: null,
    addFile: null,
    getFiles: null,
    getFilesMetadata: null
})

export const VaultProvider = ({ children, keyserver }) => {
    const { account, network } = useWeb3()
    // @todo : Use state for multiple keyservers.
    // const [keyservers, setKeyservers] = useState([])
    const [keyUploaded, setKeyUploaded] = useState(false)
    const [key, setKey] = useState(null)
    const [hasSignature, setHasSignature] = useState(null)

    // @todo Fix OpenPGP worker path.
    // Initialize OpenPGP worker.
    // useEffect(() => {
    //     openpgp.initWorker({ path: '/openpgp.worker.js', n: 2 })
    //     return async () => {
    //         await openpgp.destroyWorker()
    //     }
    // }, [])

    useEffect(() => {
        if (account && keyserver) { loadKey(true) }
    }, [account, keyserver])

    const _createSignature = async () => {
        const account = await getAccount().then(a => a && a.toLowerCase())
        const signature = await generateSignature()
        // Signature is temporarily stored in session storage.
        sessionStorage.setItem(`organigram-vault-signature-${account}`, signature)
        setHasSignature(true)
        return signature
    }

    const _deleteSignature = async () => {
        const account = await getAccount().then(a => a && a.toLowerCase())
        sessionStorage.removeItem(`organigram-vault-signature-${account}`)
        setHasSignature(false)
    }

    const createKey = async (_setKey = false) => {
        const account = await getAccount()
        const signature = sessionStorage.getItem(`organigram-vault-signature-${account}`.toLowerCase()) ||
            await _createSignature()
        const _key = await generateKey(signature)
        if (_setKey) { setKey(_key) }
        return _key
    }

    const loadKey = async (_setKey = false, account = null) => {
        if (!keyserver) { throw new Error('Key load error : Keyserver not found.') }
        const currentAccount = await getAccount()
        if (!account) { account = currentAccount }
        if (account && account === currentAccount) { setKeyUploaded(false) }
        const _key = await keyserver.loadKey(account)
        if (account && account === currentAccount) {
            if (_key) setKeyUploaded(true)
            if (_setKey) setKey(_key)
        }
        return _key
    }

    const uploadKey = async (_key = null) => {
        if (!keyserver || !keyserver.address || !(await Organ.isOrgan(keyserver.address).catch(() => false))) { throw new Error('Key upload error : Keyserver not found.') }
        if (!_key) { _key = key }
        if (!_key) { throw new Error('Key upload error : Key not supplied for upload.') }
        return keyserver.uploadKey(_key).then(res => {
            setKeyUploaded(true)
            return res
        })
    }

    const addFile = async (file, recipientsKeys = [], signatureKey = null) => {
        if (!openpgp || !openpgp.message) { throw new Error('OpenPGP not loaded.') }
        if (!key || !key.privateKeyArmored) { throw new Error('No key found.') }
        // Generate a new password.
        const password = await generatePassword()
        const metadata = {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            uploadedAt: Date.now(),
            encryption: {
                cipher: 'aes256',
                type: 'symmetric',
                password
            }
        }
        // Encrypt file data from stream.
        const reader = (await file.stream()).getReader()
        const readableStream = new ReadableStream({
            start (controller) {
                function push () {
                    // value is a "Uint8Array"
                    reader.read().then(({ done, value }) => {
                        if (done) {
                            controller.close()
                            return
                        }
                        controller.enqueue(value)
                        push()
                    })
                }
                push()
            }
        })
        // Uses aes256 for encryption, default of openpgp.config.encryption_cipher.
        const { message } = await openpgp.encrypt({
            message: openpgp.message.fromBinary(readableStream), // input as Message object
            passwords: [password],
            armor: false // Uint8Array output
        })
        // encrypted is ReadableStream<Uint8Array>
        const encrypted = message.packets.write()

        // Upload encrypted file to IPFS.
        const fileCid = await ipfs.add(encrypted)
        .then(result => result.cid)
        .catch(error => {
            console.error(error.message)
            throw new Error(error.message)
        })
        if (!fileCid) { throw new Error('Unable to add encrypted file to IPFS.') }
        metadata.cid = `${fileCid}`

        // Encrypt metadata file for current user.
        // @todo : Select file recipients beforehand.
        const ciphermetadata = await _encryptMessagePGP(JSON.stringify(metadata), [key, ...recipientsKeys], [key])

        const metadataCid = await ipfs.add(ciphermetadata)
        .then(result => result.cid)
        .catch(error => {
            console.error(error.message)
            throw new Error(error.message)
        })
        return metadataCid
    }

    // Returns an array of decrypted Uint8Array
    const getFiles = async cid => {
        if (!openpgp || !openpgp.message) { throw new Error('OpenPGP not loaded.') }
        const signature = await sessionStorage.getItem(`organigram-vault-signature-${account}`.toLowerCase())
        if (!signature) { throw new Error('Signature not found.') }
        const filesMetadata = await getFilesMetadata(cid)
        .catch(_error => [])

        const files = []
        for (const metadata of filesMetadata) {
            // Decrypt files at cid.
            if (!metadata || !metadata.cid || !metadata.encryption || !metadata.encryption.password) { throw new Error('Metadata file is not a valid reference to encrypted data.') }
            for await (const file of ipfs.get(metadata.cid)) {
                if (!file.content) continue
                const fileContent = []
                for await (const chunk of file.content) {
                    fileContent.push(chunk)
                }
                // cipherfile is Uint8Array
                const cipherfile = concat(fileContent)
                // Decrypt file. clearbits is Uint8Array
                // @todo : Use ReadableStream instead of Uint8Array.
                const { data: clearbits } = await openpgp.decrypt({
                    message: await openpgp.message.read(cipherfile),
                    passwords: [metadata.encryption.password],
                    format: 'binary' // output as Uint8Array
                })
                .catch(decryptionError => {
                    console.warn(decryptionError.message)
                    return { data: cipherfile }
                })
                const clearfile = new File(
                    [clearbits],
                    `${metadata.name}`,
                    { type: metadata.type }
                )
                files.push(clearfile)
            }
        }
        return files
    }

    const getFilesMetadata = async cid => {
        if (!openpgp || !openpgp.message) { throw new Error('OpenPGP not loaded.') }
        const signature = await sessionStorage.getItem(`organigram-vault-signature-${account}`.toLowerCase())
        if (!signature) { throw new Error('Signature not found.') }
        const filesMetadata = []
        for await (const metadataFile of ipfs.get(cid)) {
            if (!metadataFile.content) continue
            const metadataContent = []
            for await (const chunk of metadataFile.content) {
                metadataContent.push(chunk)
            }
            // ciphermetadata is Uint8Array
            const ciphermetadata = concat(metadataContent)
            // @todo : Detect if file is an encrypted JSON.
            let metadata = await _decryptMessagePGP(Buffer.from(ciphermetadata).toString(), key, signature)
            try {
                metadata = JSON.parse(metadata)
            } catch (error) {
                console.error('Error decrypting metadata file. The file is not valid JSON.', error.message)
            }
            filesMetadata.push(metadata)
        }
        return filesMetadata
    }

    // const getKeys = async () => {
    //     let sessionSignature = sessionStorage.getItem(`organigram-vault-signature-${account}`, signature)
    //     if (!sessionSignature || !(await verifySignature(sessionSignature, account)))
    //         throw new Error('Signature not valid')

    //     // Session signature is valid and can be used to generate a deterministic PGP private key.
    //     const {
    //         privateKeyArmored,
    //         publicKeyArmored,
    //         revocationCertificate
    //       } = await openpgp.generateKey({
    //         userIds: [{ name: _keys.account, account: _keys.account }],
    //         numBits: 4096, // Using RSA 4096b to encrypt the key.
    //         passphrase: sessionSignature
    //       })
    //       if (!privateKeyArmored || !publicKeyArmored) { throw new Error('PGP Key generation failed.') }
    //       _keys.private = privateKeyArmored
    //       _keys.public = publicKeyArmored
    //       _keys.revocationCertificate = revocationCertificate
    //       _keys.synchronized = false

    //     if (sessionSignature && !await ) {
    //         sessionSignature = await _generateSignature()
    //     }

    // }

    // const [keys, setKeys] = useState(
    //   JSON.parse(window.localStorage.getItem('vault-keys')) || {
    //     account: null,
    //     signature: null,
    //     public: null,
    //     private: null,
    //     synchronized: false
    //   }
    // )
    // const [errors, setErrors] = useState([])
    // // Derive public key if missing.
    // if (keys && keys.private && !keys.public) {
    //   keys.public = '' // @todo : get public key from private.
    // }

    return (
        <VaultContext.Provider
            value={{
                key,
                keyserver,
                keyUploaded,
                hasSignature,
                _createSignature,
                _deleteSignature,
                createKey,
                loadKey,
                uploadKey,
                addFile,
                getFiles,
                getFilesMetadata
            }}
        >
            {children}
        </VaultContext.Provider>
    )
}

export const useVault = () => React.useContext(VaultContext)

export const withVaultProvider = ComposedComponent =>
    props => (
        <VaultProvider>
            <ComposedComponent {...props} />
        </VaultProvider>
    )
