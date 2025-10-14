
import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Payment } from '../types';

interface PaymentFormProps {
  onClose: () => void;
  paymentToEdit?: Payment | null;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onClose, paymentToEdit }) => {
  const { addPayment, updatePayment, groups } = useData();
  const [studentName, setStudentName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (paymentToEdit) {
      setStudentName(paymentToEdit.studentName);
      setGroupName(paymentToEdit.groupName);
      setAmount(String(paymentToEdit.amount));
      setDate(new Date(paymentToEdit.date).toISOString().split('T')[0]);
    } else {
        // Reset form for new entry
        setStudentName('');
        setGroupName(groups[0]?.name || '');
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
    }
  }, [paymentToEdit, groups]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!studentName.trim()) newErrors.studentName = 'اسم الطالب مطلوب';
    if (!groupName.trim()) newErrors.groupName = 'لازم تختار مجموعة';
    if (!amount) newErrors.amount = 'المبلغ مطلوب';
    else if (isNaN(Number(amount)) || Number(amount) <= 0) newErrors.amount = 'لازم المبلغ يكون رقم أكبر من صفر';
    if (!date) newErrors.date = 'التاريخ مطلوب';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const paymentData = {
      studentName,
      groupName,
      amount: Number(amount),
      date,
    };

    if (paymentToEdit) {
      updatePayment({ ...paymentData, id: paymentToEdit.id });
    } else {
      addPayment(paymentData);
    }
    onClose();
  };

  const renderError = (field: string) => errors[field] ? <p className="text-red-400 text-sm mt-1">{errors[field]}</p> : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="studentName" className="block text-brand-light mb-2">اسم الطالب</label>
        <input
          type="text"
          id="studentName"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="w-full bg-brand-blue border border-brand-secondary rounded-lg p-3 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition text-white"
        />
        {renderError('studentName')}
      </div>
      <div>
        <label htmlFor="groupName" className="block text-brand-light mb-2">المجموعة</label>
        <select
          id="groupName"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full bg-brand-blue border border-brand-secondary rounded-lg p-3 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition text-white"
        >
          <option value="" disabled>-- اختر مجموعة --</option>
          {groups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
        </select>
         {renderError('groupName')}
      </div>
      <div>
        <label htmlFor="amount" className="block text-brand-light mb-2">الفلوس اللي اتدفعت</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-brand-blue border border-brand-secondary rounded-lg p-3 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition text-white"
        />
        {renderError('amount')}
      </div>
      <div>
        <label htmlFor="date" className="block text-brand-light mb-2">تاريخ الدفع</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-brand-blue border border-brand-secondary rounded-lg p-3 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition text-white"
        />
        {renderError('date')}
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onClose} className="py-2 px-6 rounded-lg bg-brand-secondary text-white hover:bg-opacity-80 transition">
          إلغاء
        </button>
        <button type="submit" className="py-2 px-6 rounded-lg bg-brand-gold text-brand-blue font-bold hover:bg-opacity-90 transition shadow-lg">
          {paymentToEdit ? 'حفظ التعديل' : 'إضافة الدفعة'}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;
