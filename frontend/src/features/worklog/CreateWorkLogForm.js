import { useState } from 'react';
import { useCreateNewWorkLogMutation } from './workLogApiSlice';
import { Link } from 'react-router-dom';

const emptyItem = { product_id: '', quantity: '' };

export default function CreateWorkLogForm() {
  const [message, setMessage] = useState('');
  const [items, setItems] = useState([ { ...emptyItem } ]);
  const [createWorkLog, { isLoading, isError, error }] = useCreateNewWorkLogMutation();

  const addRow = () => setItems(prev => [...prev, { ...emptyItem }]);
  const removeRow = (idx) => setItems(prev => prev.filter((_, i) => i !== idx));
  const updateRow = (idx, field, value) =>
    setItems(prev => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));

  const canSave =
    !isLoading &&
    message &&
    items.every(r =>
      String(r.product_id).trim() !== '' &&
      String(r.quantity).trim() !== '' &&
      Number.isFinite(Number(r.product_id)) &&
      Number.isFinite(Number(r.quantity))
    );

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSave) return;

    const payload = {
      message,
      items: items.map(r => ({
        product_id: Number(r.product_id),
        quantity: Number(r.quantity)
      }))
    };

    try {
      await createWorkLog(payload).unwrap();
      // reset
      setMessage('');
      setItems([ { ...emptyItem } ]);
    } catch (err) {
      // handled by isError below
    }
  };

  return (
    <form className="worklog-form" onSubmit={onSubmit}>
      <h2>Create Work Log</h2>

      <Link to="/dash/worklogs">Back</Link>

      <div className="row">
        <label>Message</label>
        <textarea
          rows={3}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Shift notes…"
          required
        />
      </div>

      <fieldset className="items-fieldset">
        <legend>Products Made</legend>

        <table className="items-table">
          <thead>
            <tr><th>Product ID</th><th>Quantity</th><th></th></tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <tr key={idx}>
                <td>
                  <input
                    type="number"
                    value={it.product_id}
                    onChange={e => updateRow(idx, 'product_id', e.target.value)}
                    min="0"
                    required
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={it.quantity}
                    onChange={e => updateRow(idx, 'quantity', e.target.value)}
                    min="0"
                    required
                  />
                </td>
                <td>
                  <button type="button" onClick={() => removeRow(idx)} disabled={items.length === 1}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="button" onClick={addRow}>+ Add product</button>
      </fieldset>

      <div className="row">
        <button type="submit" disabled={!canSave || isLoading}>
          {isLoading ? 'Saving…' : 'Create Work Log'}
        </button>
      </div>

      {isError && (
        <p className="errmsg">{error?.data?.message || 'Failed to create work log.'}</p>
      )}
    </form>
  );
}