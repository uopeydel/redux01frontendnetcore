import { Action, Reducer } from 'redux';
import { AppThunkAction, NCJDResult } from '.';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface SampleDatasState {
    isLoading: boolean;
    startDateIndex?: number;
    ldatas: SampleData[];
}

export interface SampleData {
    id: number;
    age: number;
    name: string;
    items: ItemModel[];
}

export interface ItemModel {
    id: number;
    name: string;
    sampleDataId: number;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestSampleDatasAction {
    type: 'REQUEST_SAMPLE_DATAS';
    startDateIndex: number;
}

interface ReceiveSampleDatasAction {
    type: 'RECEIVE_SAMPLE_DATAS';
    startDateIndex: number;
    ldatas: SampleData[];
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestSampleDatasAction | ReceiveSampleDatasAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestSampleDatas: (startDateIndex: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.sampleDatas && startDateIndex !== appState.sampleDatas.startDateIndex) {

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            };

            fetch(`http://localhost:5109/api/SampleData/Read`, requestOptions)
                .then(response => response.json() as Promise<NCJDResult<SampleData[]>>)
                .then(data =>
                {
                    dispatch(
                        {
                            type: 'RECEIVE_SAMPLE_DATAS',
                            startDateIndex: startDateIndex,
                            ldatas: data.data
                        });
                });

            dispatch({ type: 'REQUEST_SAMPLE_DATAS', startDateIndex: startDateIndex });
        }
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: SampleDatasState = { ldatas: [], isLoading: false };

export const reducer: Reducer<SampleDatasState> = (state: SampleDatasState | undefined, incomingAction: Action): SampleDatasState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_SAMPLE_DATAS':
            return {
                startDateIndex: action.startDateIndex,
                ldatas: state.ldatas,
                isLoading: true
            };
        case 'RECEIVE_SAMPLE_DATAS':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            var debug = action.startDateIndex;
            if (action.startDateIndex === state.startDateIndex) {
                return {
                    startDateIndex: action.startDateIndex,
                    ldatas: action.ldatas,
                    isLoading: false
                };
            }
            break;
    }

    return state;
};
