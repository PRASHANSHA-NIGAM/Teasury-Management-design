import React, { useState, useEffect } from 'react';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseSummary } from './components/ExpenseSummary';
import { Expense } from './types';

function App() {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = (expense: Expense) => {
    setExpenses(prev => [expense, ...prev]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-2 text-blue-900">个人记账本</h1>
        <p className="text-center text-blue-600 mb-12">轻松记录每一笔支出</p>
        
        <div className="grid gap-8 md:grid-cols-[1fr,340px]">
          <div className="space-y-8">
            <ExpenseForm onAddExpense={handleAddExpense} />
            <ExpenseList 
              expenses={expenses} 
              onDeleteExpense={handleDeleteExpense}
            />
          </div>
          
          <div className="sticky top-8 h-fit">
            <ExpenseSummary expenses={expenses} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;