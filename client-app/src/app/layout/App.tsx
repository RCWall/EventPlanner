
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';


function App() {
  
  //state variable used to store the activities that are returned from the API
  //passed to the ActivityDashboard component  as props along with the other functions and state variables
  const [activities, setActivities] = useState<Activity[]>([]);

  //this will be used to store the activity that the user clicks on
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);

  //this will be used to determine if the user is in edit mode or not
  const [editMode, setEditMode] = useState(false);

  
  //gets the activities from the API
  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities')
    .then(response => {
      //
      setActivities(response.data)
    })
  }, [])
  
  

  //the function will take in the id of the activity that was clicked on and will use it to find the activity in the activities array
  function handleSelectActivity(id: string) {
    setSelectedActivity(activities.find(x => x.id === id))
  }

  //this function will be used to set the selectedActivity to undefined
  function handleCancelSelectActivity() {
    setSelectedActivity(undefined);
  }

  //
  function handleFormOpen(id?: string) {
    //if the id is undefined, then the user is creating a new activity else the user is editing an existing activity
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  // this function will be used to close the form
  function handleFormClose() {
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity) {
    //if the activity id is null, then the user is creating a new activity
    activity.id 
     ? setActivities([...activities.filter(x => x.id !== activity.id), activity])
     : setActivities([...activities, {...activity, id: uuid()}]);
    setEditMode(false);
    setSelectedActivity(activity);
  }

  function handleDeleteActivity(id: string) {
    setActivities([...activities.filter(x => x.id !== id)])
  }

  //renders navbar and activity dashboard components
  return (
  <>  
   <NavBar openForm={handleFormOpen}/>
   <Container style = {{ marginTop: '7em' }}>
     <ActivityDashboard
      activities={activities} 
      selectedActivity={selectedActivity}
      selectActivity={handleSelectActivity}
      cancelSelectActivity={handleCancelSelectActivity}
      editMode={editMode}
      openForm={handleFormOpen}
      closeForm={handleFormClose}
      createOrEdit={handleCreateOrEditActivity}
      deleteActivity={handleDeleteActivity}
     />
   </Container>
  </> 
  )
}

export default App
