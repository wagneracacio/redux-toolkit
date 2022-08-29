import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { amountAdded } from "./features/counter/counter-slice";
import { useFetchBreedsQuery } from "./features/dogs/dogs-api-slice";
import "./App.css";

function App() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  const [numDogs, setNumDogs] = useState(10);
  const { data = [], isFetching } = useFetchBreedsQuery(numDogs);
  function buttonClick() {
    dispatch(amountAdded(3));
  }
  const [dogs, setDogs] = useState(data);
  function handleOnDragEnd(result: any) {
    if (!result.destination) return;
    const { source, destination } = result;
    setDogs((prevdogs) => {
      const result = Array.from(prevdogs); // Create a new array to not mutate the previous one
      const [removed] = result.splice(source.index, 1); // Removes the drag item from the array by using the start index
      result.splice(destination.index, 0, removed); // Inserts the moved item at its new position using the end index
      return result; // Returns the reordered array to the hook to be saved
    });
    
  }
  return (
    <div className="App">
      <header className="App-header">
        <p>
          <button onClick={buttonClick}>count is: {count}</button>
        </p>
        <div>
          <p>Dogs to fetch:</p>
          <select
            value={numDogs}
            onChange={(e) => setNumDogs(Number(e.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
        <div>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="dogs">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef}>
                  {dogs.map((breed, index) => {
                    return (
                      <Draggable
                        key={breed.id.toString()}
                        draggableId={breed.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            {breed.name}
                            <img
                              src={breed.image.url}
                              alt={breed.name}
                              height={250}
                            />
                          </li>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </header>
    </div>
  );
}

export default App;
