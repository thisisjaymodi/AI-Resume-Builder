import { GraduationCap, Plus, School, Trash2 } from "lucide-react";
import React from "react";

const EductionForm = ({ data, onChange }) => {

  const addEducation = () => {
    const newEducation = {
      institution: "",
      degree: "",
      field: "",
      graduation_date: "",
      gpa: "",
    };
    
    onChange([...data , newEducation]);
    //Yes we should handle input data state change using onChange. But on every character change we should not update object structure. I think to update the object once the input gets blur
  };

  const removeEducation = (index) => {
    const updated = data.filter((_, i) => {
      return i !== index;
    });
    onChange(updated);
  };
  const updateEducation = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  
  

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            Education
          </h3>
          <p className="text-sm text-gray-500">Add your education details</p>
        </div>
        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
        >
          <Plus className="size-4" />
          Add Education
        </button>
      </div>
      
      
      {!data || data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No education details added yet.</p>
          <p className="text-sm">
            Click "{<Plus className="size-4 text-gray-400 inline" />} Add
            Education" to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((education, index) => {
            return (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg space-y-3"
              >
                <div className="flex justify-between items-start">
                  <h4>Education #{index + 1}</h4>
                  {/* Experience #1 .. #2 .. #3 */}
                  <button
                    onClick={() => {
                      removeEducation(index);
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={education.institution || ""}
                    onChange={(e) => {
                      updateEducation(index, "institution", e.target.value);
                    }}
                    placeholder="Institution Name"
                    className="px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={education.degree || ""}
                    onChange={(e) => {
                      updateEducation(index, "degree", e.target.value);
                    }}
                    placeholder="Degree (e.g., Bachelor's, Master's)"
                    className="px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={education.field || ""}
                    onChange={(e) => {
                      updateEducation(index, "field", e.target.value);
                    }}
                    placeholder="Field of study (e.g., Computer Science, Manufacturing, Civil )"
                    className="px-3 py-2 text-sm"
                  />
                  <input
                    type="month"
                    value={education.graduation_date || ""}
                    onChange={(e) => {
                      updateEducation(index, "graduation_date", e.target.value);
                    }}
                    className="px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={education.gpa || ""}
                    onChange={(e) => {
                      updateEducation(index, "gpa", e.target.value);
                    }}
                    placeholder="GPA (optional)"
                    className="px-3 py-2 text-sm"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
    
  );
};

export default EductionForm;
