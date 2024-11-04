import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { fetchBudget, updateBudget } from "../../utils/budget-utils";

const Budget = () => {
  let { budget } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(budget);

  useEffect(() => {
	  loadBudget();
    }, []);
    // Function to load budget and handle errors
  const loadBudget = async () => {
	try {
  	const serverBudget = await fetchBudget();
    budget = serverBudget;
	} catch (err: any) {
  	console.log(err.message);
	}

};
  const handleEditClick = (event: any) => {
    setIsEditing(true);
    budget = event.target.value;
    updateBudget(budget);
    setInputValue(budget);
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
