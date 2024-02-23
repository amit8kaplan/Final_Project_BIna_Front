import React, { useEffect, useState } from "react";
import { fetchCourses } from "../services/course-service";



export const Store: React.FC = () => {
  const [courses, setCourses] = useState<any>([]);

  useEffect(() => {
    const fetchCoursesFromServer = async () => {
      setCourses(await fetchCourses())
    }
    fetchCoursesFromServer();
  }, [])
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  // State for search query
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Function to handle topic selection
  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
  };

  // Function to handle search input
  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  // Filter courses based on selected topic and search query
  const filteredCourses = courses.filter((course: any) => {
    if (
      selectedTopic &&
      course.name.toLowerCase().includes(selectedTopic.toLowerCase())
    ) {
      return true;
    }
    if (
      !selectedTopic &&
      course.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return true;
    }
    return false;
  });

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Topics</h5>
              <div className="btn-group-vertical">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => handleTopicSelect("Topic 1")}
                >
                  Topic 1
                </button>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => handleTopicSelect("Topic 2")}
                >
                  Topic 2
                </button>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => handleTopicSelect("Topic 3")}
                >
                  Topic 3
                </button>
                {/* Add more topics as needed */}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <input
            type="text"
            className="form-control mb-4"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          {filteredCourses.map((course: any) => (
            <div className="card mb-3" key={course.id}>
              <div className="card-body">
                <h5 className="card-title">{course.name}</h5>
                <p className="card-text">{course.description}</p>
                <button className="btn btn-primary">Buy</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
