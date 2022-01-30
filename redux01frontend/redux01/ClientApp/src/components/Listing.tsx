import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as SampleDatasStore from '../store/SampleDatas';

// At runtime, Redux will merge together...
type SampleDataProps =
    SampleDatasStore.SampleDatasState // ... state we've requested from the Redux store
    & typeof SampleDatasStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ startDateIndex: string }>; // ... plus incoming routing parameters


class Listing extends React.PureComponent<SampleDataProps> {
    // This method is called when the component is first added to the document
    public componentDidMount() {
        this.ensureDataFetched();
    }

    // This method is called when the route parameters change
    public componentDidUpdate() {
        this.ensureDataFetched();
    }

    public render() {
        return (
            <React.Fragment>
                <h1 id="tabelLabel">Listing page</h1>
                <p>This page show listing</p>
                {this.renderSampleDatasTable()}
                {/*{this.renderPagination()}*/}
            </React.Fragment>
        );
    }

    private ensureDataFetched() {
        const startDateIndex = parseInt(this.props.match.params.startDateIndex, 10) || 0;
        this.props.requestSampleDatas(startDateIndex);
    }

    private renderSampleDatasTable() {
        if (this.props.ldatas == undefined || this.props.ldatas == null) {
            return (<div>loading</div>)
        }
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Temp. (C)</th>
                        <th>Temp. (F)</th>
                        <th>Summary</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.ldatas.map((SampleData: SampleDatasStore.SampleData) =>
                            <tr key={SampleData.id}>
                                <td>{SampleData.id}</td>
                                <td>{SampleData.name}</td>
                                <td>{
                                    SampleData.items.map((sdItem: SampleDatasStore.ItemModel) =>
                                        <div>
                                            {sdItem.name}
                                        </div>
                                    )
                                }
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        );
    }

    private renderPagination() {
        const prevStartDateIndex = (this.props.startDateIndex || 0) - 5;
        const nextStartDateIndex = (this.props.startDateIndex || 0) + 5;

        return (
            <div className="d-flex justify-content-between">
                <Link className='btn btn-outline-secondary btn-sm' to={`/fetch-data/${prevStartDateIndex}`}>Previous</Link>
                {this.props.isLoading && <span>Loading...</span>}
                <Link className='btn btn-outline-secondary btn-sm' to={`/fetch-data/${nextStartDateIndex}`}>Next</Link>
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => state.sampleDatas, // Selects which state properties are merged into the component's props
    SampleDatasStore.actionCreators // Selects which action creators are merged into the component's props
)(Listing as any); // eslint-disable-line @typescript-eslint/no-explicit-any
