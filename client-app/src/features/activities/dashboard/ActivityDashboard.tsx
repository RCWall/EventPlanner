
import { Grid } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import LoadingComponent from '../../../app/layout/LoadingComponent';



// Purpose of this component is to display the ActivityList, ActivityDetails, and ActivityForm components
export default observer  (function ActivityDashboard() {

    const {activityStore} = useStore();

    //gets the activities from the API and reformat the date
    useEffect(() => {
         activityStore.loadActivities();
    }, [activityStore])
    
  
  
    //renders navbar and activity dashboard components
    if (activityStore.loadingInitial) return <LoadingComponent content='Loading app' />

    return (
        <Grid>
           < Grid.Column width='10'>
                {/*ActivityList component, passing activities and selectActivity as props*/}
                <ActivityList />
           </Grid.Column>
           <Grid.Column width='6'>
            <h2>Activity Filters</h2>
           </Grid.Column>
        </Grid>
    )
})