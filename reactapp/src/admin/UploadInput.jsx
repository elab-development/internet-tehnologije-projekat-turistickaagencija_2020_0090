import React, { useState } from 'react';
import axios from 'axios';

const UploadInput = ({ value, onChange, label = 'Slika' }) => {
  const [uploading, setUploading] = useState(false);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const token = localStorage.getItem('api_token');
      const form = new FormData();
      form.append('file', file);
      const res = await axios.post('http://localhost:8000/api/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });
      onChange(res.data.url);
    } catch (_) {
      alert('Greška pri uploadu.');
    } finally { setUploading(false); }
  };

  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input type="file" accept="image/*" onChange={onFile} />
      {uploading && <div className="text-sm text-gray-500">Otpremanje...</div>}
      {value && (
        <div className="mt-2">
          <img src={value} alt="preview" className="max-h-40 rounded border" onError={(e)=>{e.currentTarget.style.display='none';}} />
          <div className="text-xs text-gray-600 break-all">{value}</div>
        </div>
      )}
    </div>
  );
};

export default UploadInput;


