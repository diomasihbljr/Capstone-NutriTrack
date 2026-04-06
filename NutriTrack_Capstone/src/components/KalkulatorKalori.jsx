import { useState } from 'react'

const AKTIVITAS = [
  { label: 'Tidak Aktif (jarang olahraga)',             faktor: 1.2   },
  { label: 'Sedikit Aktif (1-3x/minggu)',               faktor: 1.375 },
  { label: 'Aktivitas Sedang (3-5x/minggu)',            faktor: 1.55  },
  { label: 'Sangat Aktif (6-7x/minggu)',                faktor: 1.725 },
  { label: 'Ekstra Aktif (olahraga berat/kerja fisik)', faktor: 1.9   },
]

const HARI_OPTS = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu']

/* ── Modal pilih beberapa hari sekaligus ── */
function ModalPilihHari({ show, kalori, tipe, onPilih, onTutup }) {
  const [dipilih, setDipilih] = useState([])

  if (!show) return null

  const toggle = (hari) => {
    setDipilih(prev =>
      prev.includes(hari) ? prev.filter(h => h !== hari) : [...prev, hari]
    )
  }

  const pilihSemua = () => {
    setDipilih(dipilih.length === HARI_OPTS.length ? [] : [...HARI_OPTS])
  }

  const terapkan = () => {
    if (dipilih.length === 0) return
    dipilih.forEach(hari => onPilih(hari, kalori, tipe))
    setDipilih([])
    onTutup()
  }

  return (
    <div className="modal-overlay show" onClick={e => e.target.classList.contains('modal-overlay') && onTutup()}>
      <div className="modal modal-sm">
        <div className="modal-header">
          <div className="modal-title">Gunakan Target Kalori</div>
          <button className="modal-close" onClick={onTutup}>✕</button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize:13, color:'#555', marginBottom:14 }}>
            Target <strong style={{ color:'#7c3aed' }}>{kalori?.toLocaleString('id-ID')} kcal</strong>
            {' '}({tipe}) — pilih hari yang ingin diterapkan:
          </p>

          {/* Pilih semua */}
          <div
            style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10, cursor:'pointer' }}
            onClick={pilihSemua}
          >
            <div className={'hari-checkbox' + (dipilih.length === HARI_OPTS.length ? ' checked' : '')}>
              {dipilih.length === HARI_OPTS.length && '✓'}
            </div>
            <span style={{ fontSize:13, fontWeight:600, color:'#555' }}>
              {dipilih.length === HARI_OPTS.length ? 'Batalkan semua' : 'Pilih semua hari'}
            </span>
          </div>

          {/* Grid checkbox hari */}
          <div className="hari-grid">
            {HARI_OPTS.map(hari => (
              <div
                key={hari}
                className={'hari-item' + (dipilih.includes(hari) ? ' selected' : '')}
                onClick={() => toggle(hari)}
              >
                <div className={'hari-checkbox' + (dipilih.includes(hari) ? ' checked' : '')}>
                  {dipilih.includes(hari) && '✓'}
                </div>
                <span className="hari-nama">{hari}</span>
              </div>
            ))}
          </div>

          {dipilih.length > 0 && (
            <div style={{ fontSize:12, color:'#7c3aed', marginTop:10, fontWeight:600 }}>
              {dipilih.length} hari dipilih
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn-batal" onClick={onTutup}>Batal</button>
          <button
            className="btn-simpan"
            onClick={terapkan}
            disabled={dipilih.length === 0}
            style={{ opacity: dipilih.length === 0 ? 0.5 : 1 }}
          >
            ✓ Terapkan {dipilih.length > 0 ? `(${dipilih.length} hari)` : ''}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function KalkulatorKalori({ onTerapkan }) {
  const [usia,       setUsia]       = useState('')
  const [gender,     setGender]     = useState('laki')
  const [tinggi,     setTinggi]     = useState('')
  const [berat,      setBerat]      = useState('')
  const [aktivitas,  setAktivitas]  = useState(2)
  const [hasil,      setHasil]      = useState(null)
  const [error,      setError]      = useState('')
  const [modalHari,  setModalHari]  = useState(null)
  const [diterapkan, setDiterapkan] = useState([])

  const hitung = () => {
    if (!usia || !tinggi || !berat) { setError('⚠️ Semua field harus diisi.'); return }
    if (Number(usia) <= 0 || Number(tinggi) <= 0 || Number(berat) <= 0) {
      setError('⚠️ Nilai tidak boleh nol atau negatif.'); return
    }
    setError('')
    const bmr = gender === 'laki'
      ? 88.362 + 13.397 * Number(berat) + 4.799 * Number(tinggi) - 5.677 * Number(usia)
      : 447.593 + 9.247 * Number(berat) + 3.098 * Number(tinggi) - 4.330 * Number(usia)
    const tdee = bmr * AKTIVITAS[aktivitas].faktor
    setHasil({ tdee: Math.round(tdee), turun: Math.round(tdee - 500), naik: Math.round(tdee + 500) })
    setDiterapkan([])
  }

  const reset = () => {
    setUsia(''); setTinggi(''); setBerat(''); setGender('laki')
    setAktivitas(2); setHasil(null); setError(''); setDiterapkan([])
  }

  const terapkan = (hari, kalori, tipe) => {
    setDiterapkan(prev => [...prev.filter(d => d.hari !== hari), { hari, kalori, tipe }])
    onTerapkan?.(hari, kalori)
  }

  const BtnGunakan = ({ kalori, tipe }) => {
    const hariYgDiterapkan = diterapkan.filter(d => d.kalori === kalori && d.tipe === tipe)
    const label = hariYgDiterapkan.length > 0
      ? `✓ ${hariYgDiterapkan.length} hari`
      : '📅 Gunakan'
    return (
      <button
        className={'kalk-btn-gunakan' + (hariYgDiterapkan.length > 0 ? ' diterapkan' : '')}
        onClick={() => setModalHari({ kalori, tipe })}
      >
        {label}
      </button>
    )
  }

  return (
    <div className="kalkulator-page">
      <h1 className="kalkulator-judul">Kalkulator Kebutuhan Kalori</h1>

      <div className="kalkulator-form">
        <div className="kalk-row">
          <div className="kalk-group">
            <label>Usia (tahun)</label>
            <input type="number" min="1" max="120" placeholder="25" value={usia} onChange={e => setUsia(e.target.value)} />
          </div>
          <div className="kalk-group">
            <label>Jenis Kelamin</label>
            <select value={gender} onChange={e => setGender(e.target.value)}>
              <option value="laki">Laki-laki</option>
              <option value="perempuan">Perempuan</option>
            </select>
          </div>
        </div>
        <div className="kalk-row">
          <div className="kalk-group">
            <label>Tinggi Badan (cm)</label>
            <input type="number" min="1" placeholder="170" value={tinggi} onChange={e => setTinggi(e.target.value)} />
          </div>
          <div className="kalk-group">
            <label>Berat Badan (kg)</label>
            <input type="number" min="1" placeholder="70" value={berat} onChange={e => setBerat(e.target.value)} />
          </div>
        </div>
        <div className="kalk-group">
          <label>Tingkat Aktivitas</label>
          <select value={aktivitas} onChange={e => setAktivitas(Number(e.target.value))}>
            {AKTIVITAS.map((a, i) => <option key={i} value={i}>{a.label}</option>)}
          </select>
        </div>
        {error && <div className="kalk-error">{error}</div>}
        <button className="kalk-btn-hitung" onClick={hitung}>Hitung Kebutuhan Kalori</button>
      </div>

      {hasil && (
        <div className="kalk-hasil">
          <div className="kalk-hasil-judul">Hasil Perhitungan</div>

          {diterapkan.length > 0 && (
            <div className="kalk-diterapkan-list">
              {diterapkan.map(d => (
                <div key={d.hari} className="kalk-diterapkan-item">
                  <span>📅 {d.hari}</span>
                  <span className="kalk-diterapkan-val">{d.kalori.toLocaleString('id-ID')} kcal</span>
                  <span className="kalk-diterapkan-tipe">{d.tipe}</span>
                </div>
              ))}
            </div>
          )}

          <div className="kalk-hasil-grid">
            <div className="kalk-hasil-card kalk-main">
              <div>
                <div className="kalk-hasil-label">Kebutuhan Kalori Harian</div>
                <div className="kalk-hasil-note">Untuk mempertahankan berat badan</div>
              </div>
              <div style={{ display:'flex', alignItems:'flex-end', gap:6 }}>
                <div className="kalk-hasil-angka">{hasil.tdee.toLocaleString('id-ID')}</div>
                <div className="kalk-hasil-satuan" style={{ paddingBottom:5 }}>kcal/hari</div>
              </div>
              <BtnGunakan kalori={hasil.tdee} tipe="Normal" />
            </div>

            <div className="kalk-hasil-card">
              <div className="kalk-hasil-label">🔽 Turun Berat Badan</div>
              <div className="kalk-hasil-angka">{hasil.turun.toLocaleString('id-ID')}</div>
              <div className="kalk-hasil-satuan">kcal/hari</div>
              <div className="kalk-hasil-note">Defisit 500 kcal/hari</div>
              <BtnGunakan kalori={hasil.turun} tipe="Turun BB" />
            </div>

            <div className="kalk-hasil-card">
              <div className="kalk-hasil-label">🔼 Naik Berat Badan</div>
              <div className="kalk-hasil-angka">{hasil.naik.toLocaleString('id-ID')}</div>
              <div className="kalk-hasil-satuan">kcal/hari</div>
              <div className="kalk-hasil-note">Surplus 500 kcal/hari</div>
              <BtnGunakan kalori={hasil.naik} tipe="Naik BB" />
            </div>
          </div>

          <button className="kalk-btn-reset" onClick={reset}>Hitung Ulang</button>
        </div>
      )}

      <ModalPilihHari
        show={!!modalHari}
        kalori={modalHari?.kalori}
        tipe={modalHari?.tipe}
        onPilih={terapkan}
        onTutup={() => setModalHari(null)}
      />
    </div>
  )
}
