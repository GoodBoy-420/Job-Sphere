import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { X } from "lucide-react";
import { Button } from "./ui/button";

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [filterData, setFilterData] = useState([]);
  const dispatch = useDispatch();
  const { allJobs, searchedQuery } = useSelector((state) => state.job);

  useEffect(() => {
    if (allJobs && allJobs.length > 0) {
      // Extract unique locations
      const uniqueLocations = [...new Set(allJobs.map((job) => job.location))];

      // Extract unique job titles
      const uniqueTitles = [...new Set(allJobs.map((job) => job.title))];

      // Extract unique job types
      const uniqueJobTypes = [];
      allJobs.forEach((job) => {
        if (job.jobType && !uniqueJobTypes.includes(job.jobType)) {
          uniqueJobTypes.push(job.jobType);
        }
      });

      // Set filter data
      setFilterData([
        {
          filterType: "Location",
          array: uniqueLocations,
        },
        {
          filterType: "Title",
          array: uniqueTitles,
        },
        {
          filterType: "Job Type",
          array: uniqueJobTypes,
        },
      ]);
    }
  }, [allJobs]);

  // Handle filter value change
  const changeHandler = (value) => {
    setSelectedValue(value);
    dispatch(setSearchedQuery(value));  // Update the searchedQuery to filter jobs
  };

  const clearFilter = () => {
    setSelectedValue("");
    dispatch(setSearchedQuery("")); // Reset search query
  };

  // Filter jobs based on the searchedQuery (jobType)
  const filteredJobs = allJobs.filter((job) =>
    searchedQuery ? job.jobType === searchedQuery : true
  );

  useEffect(() => {
    // When searchedQuery changes, filter jobs by the selected job type
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue, dispatch]);

  return (
    <div className="w-full bg-white p-3 rounded-md">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-lg">Filter Jobs</h1>
        {selectedValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilter}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500"
          >
            <X size={16} />
            Clear
          </Button>
        )}
      </div>
      <hr className="mt-3" />
      <RadioGroup value={selectedValue} onValueChange={changeHandler}>
        {filterData.map((data, index) => (
          <div key={index}>
            <h1 className="font-bold text-lg">{data.filterType}</h1>
            {data.array && data.array.length > 0 ? (
              data.array.map((item, idx) => {
                const itemId = `id${index}-${idx}`;
                return (
                  <div className="flex items-center space-x-2 my-2" key={idx}>
                    <RadioGroupItem
                      value={item}
                      id={itemId}
                      checked={selectedValue === item} // Ensure the correct radio button is checked
                    />
                    <Label htmlFor={itemId}>{item}</Label>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-gray-500 my-2">No data available</div>
            )}
          </div>
        ))}
      </RadioGroup>


    </div>
  );
};

export default FilterCard;
