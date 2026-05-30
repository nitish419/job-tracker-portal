import React, { useState, useEffect } from 'react';
import { db } from '../firebase.js'; 
// 1. We imported 'doc' and 'deleteDoc' from firebase/firestore here:
import { collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore';

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'jobs'), orderBy('dateApplied', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobsArray = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setJobs(jobsArray);
    });
    return () => unsubscribe();
  }, []);

  const addJob = async (e) => {
    e.preventDefault();
    if (!company || !role) return;
    try {
      await addDoc(collection(db, 'jobs'), {
        company,
        role,
        status: 'Applied',
        dateApplied: new Date().toISOString()
      });
      setCompany(''); 
      setRole('');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  // 2. Here is our new Delete Function!
  const deleteJob = async (id) => {
    // This adds a quick browser pop-up to make sure they didn't misclick
    if (window.confirm("Are you sure you want to delete this job application?")) {
      try {
        await deleteDoc(doc(db, 'jobs', id));
      } catch (error) {
        console.error('Error deleting document: ', error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Job Application Tracker</h1>
      
      <form onSubmit={addJob} className="flex flex-col md:flex-row gap-4 mb-10 bg-slate-50 p-6 rounded-lg border border-slate-100">
        <input 
          className="flex-1 border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text" placeholder="Company Name (e.g. Amazon)" 
          value={company} onChange={(e) => setCompany(e.target.value)} required 
        />
        <input 
          className="flex-1 border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text" placeholder="Role (e.g. Frontend Developer)" 
          value={role} onChange={(e) => setRole(e.target.value)} required 
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
          Add Job
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-6 text-slate-800">Your Applications ({jobs.length})</h2>
      
      <div className="grid gap-4">
        {jobs.map(job => (
          <div key={job.id} className="border border-slate-200 p-5 rounded-lg flex flex-col sm:flex-row justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow">
            
            <div className="mb-3 sm:mb-0 w-full">
              <h3 className="font-bold text-xl text-slate-900">{job.company}</h3>
              <p className="text-slate-600 font-medium">{job.role}</p>
            </div>
            
            {/* 3. We wrapped the status and the delete button in a flex container */}
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-blue-100 text-blue-800 whitespace-nowrap">
                {job.status}
              </span>
              
              {/* Here is the actual Delete Button */}
              <button 
                onClick={() => deleteJob(job.id)}
                className="text-red-500 hover:text-red-700 font-semibold px-3 py-1 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>

          </div>
        ))}
        
        {jobs.length === 0 && (
          <p className="text-slate-500 text-center py-8">No jobs tracked yet. Add one above!</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;