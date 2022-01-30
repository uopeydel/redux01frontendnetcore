import * as WeatherForecasts from './WeatherForecasts';
import * as SampleDatas from './SampleDatas';
import * as Counter from './Counter';

// The top-level state object
export interface ApplicationState {
    counter: Counter.CounterState | undefined;
    weatherForecasts: WeatherForecasts.WeatherForecastsState | undefined;
    sampleDatas: SampleDatas.SampleDatasState | undefined;
}

export interface NCJDResult<DataType> {
    data: DataType;
    statusCode: number;
    messages: string[];
    isSuccess: boolean;
    uuid: string;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    counter: Counter.reducer,
    weatherForecasts: WeatherForecasts.reducer,
    sampleDatas: SampleDatas.reducer
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
