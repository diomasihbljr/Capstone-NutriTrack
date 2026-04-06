import { useState } from 'react'
import { AiFillGoogleCircle } from "react-icons/ai";

export default function HalamanRegister({ onRegister, onKeLogin }) {
  const [nama,     setNama]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [konfirm,  setKonfirm]  = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error,    setError]    = useState('')

  const submit = () => {
    if (!nama || !email || !password || !konfirm) { setError('Semua field harus diisi.'); return }
    if (password !== konfirm) { setError('Password tidak cocok.'); return }
    if (password.length < 6)  { setError('Password minimal 6 karakter.'); return }
    onRegister({ nama, email })
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">N</div>
        <h2 className="auth-title">Buat Akun Baru</h2>
        <p className="auth-sub">Daftarkan diri kamu dan mulai lacak nutrisimu</p>

        <div className="auth-form">
          <div className="auth-field">
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={nama}
              onChange={e => setNama(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <input
              type="email"
              placeholder="Masukkan Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-field auth-field-pass">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button className="toggle-pass" onClick={() => setShowPass(v => !v)}>
              {showPass ? 'Sembunyikan' : 'Tampilkan'}
            </button>
          </div>

          <div className="auth-field">
            <input
              type="password"
              placeholder="Konfirmasi Password"
              value={konfirm}
              onChange={e => setKonfirm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-btn-primary" onClick={submit}>Daftar Sekarang</button>

          <div className="auth-divider"><span>— Atau daftar dengan —</span></div>

          <div className="auth-social-row">
            <button className="auth-social-btn"> <AiFillGoogleCircle /> Google</button>
          </div>

          <div className="auth-switch">
            Sudah punya akun?{' '}
            <span onClick={onKeLogin}>Masuk</span>
          </div>
        </div>
      </div>
    </div>
  )
}