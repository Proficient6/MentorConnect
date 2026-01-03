// import { useState, useEffect } from 'react';
// import { ClipboardList, Users, CheckCircle, Clock, Eye } from 'lucide-react';
// import { getMentorTasks, getMentorSubmissions } from '../utils/api';

// // Mentor Dashboard with backend integration
// function MentorDashboard({ setCurrentPage, userData }) {
//   // State for dashboard data
//   const [myTasks, setMyTasks] = useState([]);
//   const [pendingReviews, setPendingReviews] = useState([]);
//   const [inProgressWork, setInProgressWork] = useState([]);
//   const [stats, setStats] = useState({
//     activeTasks: 0,
//     totalTeams: 0,
//     pendingReviews: 0,
//     completedReviews: 0,
//     inProgressCount: 0
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');

//   // Fetch dashboard data on mount
//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       // Fetch mentor's tasks
//       const tasksResponse = await getMentorTasks();
//       if (tasksResponse.success) {
//         setMyTasks(tasksResponse.tasks);
        
//         // Calculate stats
//         const activeTasks = tasksResponse.tasks.filter(t => t.status === 'active').length;
//         const totalTeams = tasksResponse.tasks.reduce((sum, task) => sum + (task.activeTeams || 0), 0);
        
//         setStats(prev => ({
//           ...prev,
//           activeTasks,
//           totalTeams
//         }));
//       }

//       // Fetch pending submissions
//       const submissionsResponse = await getMentorSubmissions();
//       if (submissionsResponse.success) {
//         const pending = submissionsResponse.submissions.filter(s => s.status === 'submitted');
//         const inProgress = submissionsResponse.submissions.filter(s => s.status === 'in-progress');
//         setPendingReviews(pending);
//         setInProgressWork(inProgress);
        
//         setStats(prev => ({
//           ...prev,
//           pendingReviews: pending.length,
//           completedReviews: submissionsResponse.submissions.filter(s => s.status === 'reviewed').length,
//           inProgressCount: inProgress.length
//         }));
//       }
//     } catch (err) {
//       setError('Failed to load dashboard');
//       console.error('Dashboard error:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-gray-600">Loading dashboard...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Welcome Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-800">
//             Welcome back, {userData?.name || 'Mentor'}!
//           </h1>
//           <p className="text-gray-600 mt-2">Here's an overview of your mentorship activities</p>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//             {error}
//           </div>
//         )}

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          
//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm">Active Tasks</p>
//                 <p className="text-3xl font-bold text-gray-800">{stats.activeTasks}</p>
//               </div>
//               <ClipboardList className="text-gray-400" size={32} />
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm">Total Teams</p>
//                 <p className="text-3xl font-bold text-gray-800">{stats.totalTeams}</p>
//               </div>
//               <Users className="text-gray-400" size={32} />
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm">In Progress</p>
//                 <p className="text-3xl font-bold text-blue-600">{stats.inProgressCount}</p>
//               </div>
//               <Eye className="text-blue-400" size={32} />
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm">Pending Reviews</p>
//                 <p className="text-3xl font-bold text-gray-800">{stats.pendingReviews}</p>
//               </div>
//               <Clock className="text-gray-400" size={32} />
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm">Completed Reviews</p>
//                 <p className="text-3xl font-bold text-gray-800">{stats.completedReviews}</p>
//               </div>
//               <CheckCircle className="text-gray-400" size={32} />
//             </div>
//           </div>
//         </div>

//         <div className="grid md:grid-cols-2 gap-6">
          
//           {/* My Tasks Section */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-bold text-gray-800">My Tasks</h2>
//               <button 
//                 onClick={() => setCurrentPage('mentor-create-task')}
//                 className="text-sm px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
//               >
//                 Create New
//               </button>
//             </div>

//             <div className="space-y-4">
//               {myTasks.length > 0 ? (
//                 myTasks.map(task => (
//                   <div key={task._id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 cursor-pointer">
//                     <div className="flex items-start justify-between mb-3">
//                       <h3 className="font-semibold text-gray-800">{task.title}</h3>
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         task.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                       }`}>
//                         {task.status}
//                       </span>
//                     </div>
                    
//                     <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
//                       <div>
//                         <p className="font-medium">{task.applicants || 0}</p>
//                         <p className="text-xs">Applicants</p>
//                       </div>
//                       <div>
//                         <p className="font-medium">{task.activeTeams || 0}</p>
//                         <p className="text-xs">Active Teams</p>
//                       </div>
//                       <div>
//                         <p className="font-medium">{new Date(task.deadline).toLocaleDateString()}</p>
//                         <p className="text-xs">Deadline</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-8 text-gray-500">
//                   <p>No tasks created yet</p>
//                   <button 
//                     onClick={() => setCurrentPage('mentor-create-task')}
//                     className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
//                   >
//                     Create Your First Task
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Pending Reviews Section */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h2 className="text-xl font-bold text-gray-800 mb-6">Pending Reviews</h2>

//             <div className="space-y-4">
//               {pendingReviews.length > 0 ? (
//                 pendingReviews.map(review => (
//                   <div key={review._id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 cursor-pointer hover:bg-gray-50 transition-colors">
//                     <div className="mb-3">
//                       <h3 className="font-semibold text-gray-800">{review.taskId?.title || 'Task'}</h3>
//                       <p className="text-sm text-gray-600 mt-1">
//                         Student: {review.studentId?.name || 'Student'}
//                       </p>
//                     </div>
                    
//                     {/* GitHub Repository Link */}
//                     {review.githubUrl && (
//                       <div className="mb-3 p-3 bg-gray-50 rounded border border-gray-200">
//                         <p className="text-xs text-gray-600 font-medium uppercase mb-1">GitHub Repository</p>
//                         <a 
//                           href={review.githubUrl} 
//                           target="_blank" 
//                           rel="noopener noreferrer"
//                           className="text-sm text-blue-600 hover:underline break-all flex items-center gap-2"
//                         >
//                           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
//                             <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
//                           </svg>
//                           {review.githubUrl}
//                         </a>
//                       </div>
//                     )}
                    
//                     <div className="flex items-center justify-between text-sm">
//                       <span className="text-gray-600">
//                         Submitted: {new Date(review.submittedAt).toLocaleDateString()}
//                       </span>
//                       <button 
//                         onClick={() => {
//                           // Navigate to evaluation page with submission context
//                           window.location.href = `/mentor/evaluation?submissionId=${review._id}`;
//                         }}
//                         className="px-4 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 text-sm font-medium"
//                       >
//                         Review
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-8 text-gray-500">
//                   <p>No pending reviews</p>
//                   <p className="text-sm mt-2">Students will submit their work here for you to review</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* In Progress Work Section */}
//         {inProgressWork.length > 0 && (
//           <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
//             <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//               <Eye size={24} />
//               In Progress Work ({inProgressWork.length})
//             </h2>
//             <p className="text-gray-600 mb-4">Monitor the progress of students currently working on your tasks</p>

//             <div className="space-y-4">
//               {inProgressWork.map(work => (
//                 <div key={work._id} className="border border-blue-200 bg-blue-50 rounded-lg p-4 hover:border-blue-400 transition-colors">
//                   <div className="flex items-start justify-between mb-3">
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-gray-800">{work.taskId?.title || 'Task'}</h3>
//                       <p className="text-sm text-gray-600 mt-1">
//                         Team: {work.studentId?.name || 'Student'}
//                       </p>
//                     </div>
//                     <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
//                       In Progress
//                     </span>
//                   </div>

//                   {/* GitHub Repository Link */}
//                   {work.githubUrl && (
//                     <div className="mb-3 p-3 bg-white rounded border border-blue-200">
//                       <p className="text-xs text-gray-600 font-medium uppercase mb-1">GitHub Repository</p>
//                       <a 
//                         href={work.githubUrl} 
//                         target="_blank" 
//                         rel="noopener noreferrer"
//                         className="text-sm text-blue-600 hover:underline break-all flex items-center gap-2"
//                       >
//                         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
//                           <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
//                         </svg>
//                         View Repository
//                       </a>
//                     </div>
//                   )}
                  
//                   {/* Progress Notes */}
//                   {work.notes && (
//                     <div className="mb-3 p-3 bg-white rounded border border-blue-200">
//                       <p className="text-xs text-gray-600 font-medium uppercase mb-1">Progress Notes</p>
//                       <p className="text-sm text-gray-700">{work.notes}</p>
//                     </div>
//                   )}

//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-gray-600">
//                       Started: {new Date(work.createdAt).toLocaleDateString()}
//                     </span>
//                     <button 
//                       onClick={() => {
//                         window.location.href = `/mentor/task-progress?taskId=${work.taskId?._id}&studentId=${work.studentId?._id}`;
//                       }}
//                       className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
//                     >
//                       View Details
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Quick Actions */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
//           <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
//           <div className="grid md:grid-cols-3 gap-4">
//             <button 
//               onClick={() => setCurrentPage('mentor-create-task')}
//               className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 text-left"
//             >
//               <p className="font-semibold text-gray-800">Create New Task</p>
//               <p className="text-sm text-gray-600 mt-1">Post a new project for students</p>
//             </button>
            
//             <button 
//               onClick={() => setCurrentPage('mentor-evaluation')}
//               className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 text-left"
//             >
//               <p className="font-semibold text-gray-800">Review Submissions</p>
//               <p className="text-sm text-gray-600 mt-1">Evaluate pending work</p>
//             </button>
            
//             <button 
//               onClick={() => setCurrentPage('mentor-profile')}
//               className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 text-left"
//             >
//               <p className="font-semibold text-gray-800">Edit Profile</p>
//               <p className="text-sm text-gray-600 mt-1">Update your information</p>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MentorDashboard;