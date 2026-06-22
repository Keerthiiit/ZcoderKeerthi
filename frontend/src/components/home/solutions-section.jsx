import { Link } from "react-router-dom";
import '../../styles/home/solution-section.css';
import SolutionCard from "./solution-card";

const Solutions = () => {

     const topSolutions = [
    {
      id: 5,
      problem: "Valid Parenthesis",
      author: "tourist",
      language: "Java",
      votes: 250,
      explanation: "Used a stack to push opening brackets and pop for matching closing ones. Checks validity at end.",
    },
    {
      id: 14,
      problem: "3Sum",
      author: "mallikarjuna",
      language: "C++",
      votes: 200,
      explanation: "Two-pointer after sorting to avoid duplicates and reduce complexity"
    }
  ];

  return (
    <section className="solutions-section">
        <div className="section-header">
          <h2 className="section-title">Top Solutions</h2>
          <Link to="/problems" className="view-all">View All →</Link>
        </div>
        <div className="solutions-list">
          {topSolutions.map(solution => (
            <SolutionCard key={solution.id} solution={solution}/>
          ))}
        </div>
      </section>
  )
}

export default Solutions