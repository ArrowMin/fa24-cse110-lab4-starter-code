import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { fetchBudget } from "../../utils/budget-utils";

const Budget = () => {
  const { budget } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(budget);
  useEffect(() => {
	  loadBudget();
    }, []);
    // Function to load budget and handle errors
  const loadBudget = async () => {
	try {
  	const budget = await fetchBudget();
    setInputValue(budget);
	} catch (err: any) {
  	console.log(err.message);
	}
};

  const handleEditClick = (event: any) => {
    setIsEditing(true);
    setInputValue(event.target.value);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };


  return (
    <div className="alert alert-secondary p-3 d-flex align-items-center justify-content-between">
      <div data-testid="budget">
        {isEditing ? (
        <input type="number" value={inputValue} onChange={handleEditClick} />
      ) : ( 
        <>
        Budget: ${inputValue}
        <button onClick={() => setIsEditing(true)}>Edit</button>
        </>
      )}
      {isEditing && <button onClick={handleSaveClick}>Save</button>}
      </div>
    </div>
  );
};

export default Budget;
