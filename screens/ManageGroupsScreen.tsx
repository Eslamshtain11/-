import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Trash2, PlusCircle } from 'lucide-react';

const ManageGroupsScreen: React.FC = () => {
  const { groups, addGroup, deleteGroup } = useData();
  const [newGroupName, setNewGroupName] = useState('');
  const [error, setError] = useState('');

  const handleAddGroup = () => {
    setError('');
    if (!newGroupName.trim()) {
      setError('اسم المجموعة مينفعش يبقى فاضي.');
      return;
    }
    if (!addGroup(newGroupName)) {
      setError('اسم المجموعة ده موجود قبل كده.');
    } else {
      setNewGroupName('');
    }
  };

  const handleDeleteGroup = (groupName: string) => {
    if (groups.length <= 1) {
        alert("لازم يكون فيه مجموعة واحدة على الأقل.");
        return;
    }
    if (window.confirm(`متأكد إنك عايز تمسح مجموعة "${groupName}"؟`)) {
        deleteGroup(groupName);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl font-black text-white">إدارة المجموعات</h1>
        <p className="text-brand-secondary mt-2">من هنا تقدر تضيف أو تمسح المجموعات بتاعتك.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-brand-navy p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-brand-gold mb-4">إضافة مجموعة جديدة</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="اكتب اسم المجموعة..."
              className="flex-grow bg-brand-blue border border-brand-secondary rounded-lg p-3 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition text-white"
            />
            <button
              onClick={handleAddGroup}
              className="bg-brand-gold text-brand-blue font-bold p-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition shadow-md"
            >
              <PlusCircle size={20} />
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
        
        <div className="bg-brand-navy p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-brand-gold mb-4">المجموعات الحالية ({groups.length})</h3>
          <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
            {groups.length > 0 ? groups.map(group => (
              <div key={group} className="flex justify-between items-center bg-brand-blue p-3 rounded-lg">
                <span className="text-brand-light">{group}</span>
                <button
                  onClick={() => handleDeleteGroup(group)}
                  className="text-red-500 hover:text-red-400 transition"
                  aria-label={`حذف مجموعة ${group}`}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )) : (
                <p className="text-brand-secondary text-center py-4">لا توجد مجموعات حاليًا.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageGroupsScreen;