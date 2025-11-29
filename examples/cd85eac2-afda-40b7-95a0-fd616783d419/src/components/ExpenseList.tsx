import React from 'react';
import { categories } from '../data';
import { Expense } from '../types';
import * as Icons from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

export function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    const IconComponent = category ? Icons[category.icon as keyof typeof Icons] : Icons.HelpCircle;
    return <IconComponent size={20} />;
  };

  return (
    <div className="space-y-4">
      {expenses.map((expense) => {
        const category = categories.find(c => c.id === expense.category);
        
        return (
          <div
            key={expense.id}
            className="bg-white p-6 rounded-2xl shadow-md shadow-blue-100 hover:shadow-lg hover:shadow-blue-100 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  {getCategoryIcon(expense.category)}
                </div>
                <div>
                  <div className="font-medium text-blue-900">{category?.name}</div>
                  <div className="text-sm text-blue-600">{expense.description || '无描述'}</div>
                  <div className="text-xs text-blue-400 mt-1">{formatDate(expense.date)}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-semibold text-lg text-blue-900">¥{expense.amount.toFixed(2)}</span>
                <button
                  onClick={() => onDeleteExpense(expense.id)}
                  className="text-blue-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                >
                  <Icons.Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
      {expenses.length === 0 && (
        <div className="text-center text-blue-500 py-12 bg-white rounded-2xl shadow-lg shadow-blue-100">
          <Icons.PiggyBank className="mx-auto mb-4 text-blue-400" size={48} />
          <p>还没有记录支出</p>
        </div>
      )}
    </div>
  );
}