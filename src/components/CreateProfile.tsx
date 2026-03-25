import { useState } from 'react'
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { PACKAGE_ID, EXPLORER_URL } from '../config/network'

export default function CreateProfile() {
  const account = useCurrentAccount()
  const client = useSuiClient()
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction()

  const [form, setForm] = useState({
    handle: '',
    display_name: '',
    bio: '',
    avatar_url: '',
    website: '',
  })
  const [txDigest, setTxDigest] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setTxDigest('')

    if (!account) return
    if (form.handle.length < 3) {
      setError('Handle must be at least 3 characters.')
      return
    }

    const tx = new Transaction()
    const encode = (s: string) => Array.from(new TextEncoder().encode(s))

    tx.moveCall({
      target: `${PACKAGE_ID}::profile::create_profile`,
      arguments: [
        tx.pure.vector('u8', encode(form.handle)),
        tx.pure.vector('u8', encode(form.display_name)),
        tx.pure.vector('u8', encode(form.bio)),
        tx.pure.vector('u8', encode(form.avatar_url)),
        tx.pure.vector('u8', encode(form.website)),
      ],
    })

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: (result) => setTxDigest(result.digest),
        onError: (err) => setError(err.message),
      }
    )
  }

  return (
    <div className="card">
      <h2>Create On-Chain Profile</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Handle *
          <input name="handle" value={form.handle} onChange={handleChange} placeholder="e.g. web3devz" required minLength={3} />
        </label>
        <label>Display Name
          <input name="display_name" value={form.display_name} onChange={handleChange} placeholder="Your name" />
        </label>
        <label>Bio
          <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Tell the world about yourself..." rows={3} />
        </label>
        <label>Avatar URL
          <input name="avatar_url" value={form.avatar_url} onChange={handleChange} placeholder="https://..." />
        </label>
        <label>Website
          <input name="website" value={form.website} onChange={handleChange} placeholder="https://..." />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={isPending}>
          {isPending ? 'Minting Profile...' : 'Create Profile'}
        </button>
      </form>

      {txDigest && (
        <p className="success">
          ✅ Profile created!{' '}
          <a href={`${EXPLORER_URL}/txblock/${txDigest}`} target="_blank" rel="noreferrer">
            View on Explorer
          </a>
        </p>
      )}
    </div>
  )
}
