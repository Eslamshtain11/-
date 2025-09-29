import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from './Modal';
import { Trash2, PlusCircle } from 'lucide-react';

interface ManageGroupsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManageGroupsModal: React.FC<ManageGroupsModalProps> = ({ isOpen, onClose }) => {
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
    <Modal isOpen={isOpen} onClose={onClose} title="إدارة المجموعات">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-brand-light mb-2">إضافة مجموعة جديدة</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="اكتب اسم المجموعة..."
              className="flex-grow bg-brand-blue border border-brand-secondary rounded-lg p-3 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition"
            />
            <button
              onClick={handleAddGroup}
              className="bg-brand-gold text-brand-blue font-bold p-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition shadow-md"
            >
              <PlusCircle size={20} />
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        </div>

        <div className="pt-4">
          <h3 className="text-lg font-bold text-brand-light mb-2">المجموعات الحالية</h3>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
            {groups.map(group => (
              <div key={group} className="flex justify-between items-center bg-brand-blue p-3 rounded-lg">
                <span className="text-brand-light">{group}</span>
                <button
                  onClick={() => handleDeleteGroup(group)}
                  className="text-red-500 hover:text-red-400 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ManageGroupsModal;
