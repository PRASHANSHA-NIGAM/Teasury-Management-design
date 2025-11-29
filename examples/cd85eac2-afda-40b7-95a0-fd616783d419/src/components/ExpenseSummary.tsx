import React from 'react';
import { PieChart, Wallet } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Expense } from '../types';
import { categories } from '../data';

interface ExpenseSummaryProps {
  expenses: Expense[];
}

export function ExpenseSummary({ expenses }: ExpenseSummaryProps) {
  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const categoryTotals = expenses.reduce((acc, expense) => {
    const categoryId = expense.category;
    acc[categoryId] = (acc[categoryId] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg shadow-blue-100 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Wallet size={24} />
          </div>
          <h2 className="text-xl font-semibold text-blue-900">总支出</h2>
        </div>
        <span className="text-3xl font-bold text-blue-600">
          ¥{totalExpense.toFixed(2)}
        </span>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <PieChart size={24} />
          </div>
          <h3 className="text-xl font-semibold text-blue-900">分类统计</h3>
        </div>
        <div className="space-y-4">
          {categories.map((category) => {
            const amount = categoryTotals[category.id] || 0;
            const percentage = totalExpense ? ((amount / totalExpense) * 100).toFixed(1) : '0';
            const IconComponent = Icons[category.icon as keyof typeof Icons];
            
            return (
              <div key={category.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-blue-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="text-blue-600">
                    <IconComponent size={20} />
                  </div>
                  <span className="text-blue-900">{category.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium text-blue-900">¥{amount.toFixed(2)}</div>
                  <div className="text-sm text-blue-500">{percentage}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}