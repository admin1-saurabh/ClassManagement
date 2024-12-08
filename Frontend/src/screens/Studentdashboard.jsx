import React from 'react'
import Navbar from '../components/Navbar';
import Class from '../components/Class';

export default function Studentdashboard() {
    const classes = [
        {
          title: "Algorithms II",
          classcode: "CSC702",
          description: "Dive deep into advanced algorithms with Dr. Sanjay Pratihar, exploring graph algorithms, dynamic programming, and complexity analysis.",
        },
        {
          title: "Machine Learning",
          classcode: "CSC705",
          description: "Learn the fundamentals of supervised and unsupervised learning with Dr. Meera Sharma, including hands-on projects and real-world applications.",
        },
        {
          title: "Database Systems",
          classcode: "CSC601",
          description: "Master relational databases, normalization, and SQL with Prof. Arjun Das, while exploring NoSQL and modern database technologies.",
        },
        {
          title: "Computer Networks",
          classcode: "CSC604",
          description: "Understand the foundations of networking protocols, security, and cloud computing with Dr. Rajeev Ranjan.",
        },
        {
          title: "Operating Systems",
          classcode: "CSC603",
          description: "Explore core operating system concepts like process management, scheduling, and file systems with Prof. Anita Roy.",
        },
      ];
    
      return (
        <div className="h-full w-screen bg-gradient-to-b from-gray-200 via-cyan-100 to-gray-200">
          <div className="w-screen px-12 pt-4">
            <Navbar />
          </div>
          <div>
            <div className="flex flex-wrap space-x-8 py-8 px-12 justify-center">
                {classes.map((classItem, index) => (
                    <div key={index} className="w-80">
                    <Class
                        title={classItem.title}
                        classcode={classItem.classcode}
                        description={classItem.description}
                    />
                    </div>
                ))}
                </div>
          </div>
          <div className='flex fixed bottom-0 right-0 z-50 m-8'>
            <div className='px-8 py-3 bg-cyan-800 text-white rounded-2xl'>
                + Join Class
            </div>
         </div>
        </div>
      );
}
