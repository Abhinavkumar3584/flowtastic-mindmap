
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface SubExam {
  id: string;
  name: string;
  description: string;
}

interface ExamCategory {
  id: string;
  name: string;
  subExams: SubExam[];
}

// Sample data for exam categories and sub-exams
const examCategories: ExamCategory[] = [
  {
    id: "upsc",
    name: "UPSC",
    subExams: [
      { id: "cse", name: "Civil Services Examination (CSE)", description: "Conducted for recruitment to various Civil Services of the Government of India." },
      { id: "cds", name: "Combined Defence Services (CDS)", description: "Examination for recruitment to the Indian Military Academy, Officers Training Academy, and more." },
      { id: "nda", name: "National Defence Academy (NDA)", description: "National-level entrance examination for entry into Army, Navy and Air Force wings." },
      { id: "ifs", name: "Indian Forest Service (IFS)", description: "Examination for recruitment to the Indian Forest Service." }
    ]
  },
  {
    id: "ssc",
    name: "SSC",
    subExams: [
      { id: "cgl", name: "Combined Graduate Level (CGL)", description: "For recruitment to various Group B and Group C posts in various ministries." },
      { id: "chsl", name: "Combined Higher Secondary Level (CHSL)", description: "For recruitment to Lower Division Clerk, Data Entry Operator positions." },
      { id: "je", name: "Junior Engineer (JE)", description: "For recruitment to Junior Engineer positions in various departments." }
    ]
  },
  {
    id: "banking",
    name: "Banking",
    subExams: [
      { id: "sbi-po", name: "SBI PO", description: "State Bank of India Probationary Officer recruitment examination." },
      { id: "sbi-clerk", name: "SBI Clerk", description: "State Bank of India Clerk recruitment examination." },
      { id: "ibps-po", name: "IBPS PO", description: "Institute of Banking Personnel Selection Probationary Officer examination." },
      { id: "ibps-clerk", name: "IBPS Clerk", description: "Institute of Banking Personnel Selection Clerk examination." },
      { id: "rbi-grade", name: "RBI Grade B", description: "Reserve Bank of India Grade B Officer examination." }
    ]
  },
  {
    id: "railway",
    name: "Railway",
    subExams: [
      { id: "group-d", name: "Group D", description: "For recruitment to various Group D positions in Indian Railways." },
      { id: "alp", name: "Assistant Loco Pilot (ALP)", description: "For recruitment to Assistant Loco Pilot positions." },
      { id: "je-railway", name: "Junior Engineer (JE)", description: "For recruitment to Junior Engineer positions in Indian Railways." }
    ]
  },
  {
    id: "teaching",
    name: "Teaching",
    subExams: [
      { id: "ctet", name: "CTET", description: "Central Teacher Eligibility Test for teacher recruitment." },
      { id: "stet", name: "STET", description: "State Teacher Eligibility Test for state-level teacher recruitment." },
      { id: "net", name: "UGC NET", description: "National Eligibility Test for Assistant Professor and JRF positions." }
    ]
  },
  {
    id: "defence",
    name: "Defence",
    subExams: [
      { id: "afcat", name: "AFCAT", description: "Air Force Common Admission Test for entry into Indian Air Force." },
      { id: "acc", name: "ACC Exam", description: "Army Cadet College entrance examination." },
      { id: "inet", name: "Indian Navy Entrance Test", description: "Entrance examination for Indian Navy." }
    ]
  }
];

const ExamTabs: React.FC = () => {
  const [selectedExam, setSelectedExam] = useState<string>(examCategories[0].id);

  const handleExamSelect = (examId: string) => {
    setSelectedExam(examId);
  };

  return (
    <div className="flex flex-col md:flex-row w-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Left Side - Main Exam Categories */}
      <div className="w-full md:w-1/3 border-r border-gray-200">
        <Tabs 
          defaultValue={selectedExam} 
          orientation="vertical" 
          className="w-full"
          value={selectedExam}
          onValueChange={handleExamSelect}
        >
          <TabsList className="flex flex-row md:flex-col h-auto w-full bg-gray-50 p-0 space-y-0 space-x-1 md:space-x-0 md:space-y-1 overflow-x-auto md:overflow-visible">
            {examCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className={cn(
                  "w-full justify-start px-4 py-3 text-left border-l-4 rounded-none transition-all duration-200",
                  "data-[state=active]:border-l-4 data-[state=active]:border-l-indigo-600 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700",
                  "hover:bg-gray-100 hover:text-gray-900",
                  "flex items-center"
                )}
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Right Side - Sub Exams */}
      <div className="w-full md:w-2/3 p-4 bg-white">
        {examCategories.map((category) => (
          category.id === selectedExam && (
            <div key={category.id} className="space-y-4 animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-800">{category.name} Examinations</h2>
              <div className="grid grid-cols-1 gap-4">
                {category.subExams.map((subExam) => (
                  <div 
                    key={subExam.id} 
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow duration-200 bg-gray-50"
                  >
                    <h3 className="font-semibold text-indigo-700">{subExam.name}</h3>
                    <p className="text-gray-600 mt-1">{subExam.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default ExamTabs;
