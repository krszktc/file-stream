import './App.css';
import {Config} from './config.js';
import {DebounceInput} from "react-debounce-input";
import * as React from "react/cjs/react.development";


const config = new Config();
const App = () => (
  <div className="App">
    <Logger/>
  </div>
);
export default App;


class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.bufferChanged = config.bufferChanged.bind(config);
        this.showLinesChanged = config.showLinesChanged.bind(config);
    }

    render() {
        return (
            <div className="settings">
                <div>
                    <p>Buffer size:</p>
                    <DebounceInput debounceTimeout={config.debounce} value={config.buffer} onChange={this.bufferChanged}/>
                </div>
                <div>
                    <p>Show lines:</p>
                    <DebounceInput debounceTimeout={config.debounce} value={config.showLines} onChange={this.showLinesChanged}/>
                </div>
            </div>
        )
    }
}


class Filer extends React.Component {
    constructor(props) {
        super(props);
        this.timeChange = config.timeChange.bind(config);
        this.ipChange = config.ipChange.bind(config);
        this.hostChange = config.hostChange.bind(config);
        this.pathChange = config.pathChange.bind(config);
        this.uaChange = config.uaChange.bind(config);
    }

    render() {
        return (
            <div className="filter-header">
                <div>
                    <p>time</p>
                    <DebounceInput debounceTimeout={config.debounce} value={config.time} onChange={this.timeChange}/>
                </div>
                <div>
                    <p>ip</p>
                    <DebounceInput debounceTimeout={config.debounce} value={config.ip} onChange={this.ipChange}/>
                </div>
                <div>
                    <p>host</p>
                    <DebounceInput debounceTimeout={config.debounce} value={config.host} onChange={this.hostChange}/>
                </div>
                <div>
                    <p>path</p>
                    <DebounceInput debounceTimeout={config.debounce} value={config.path} onChange={this.pathChange}/>
                </div>
                <div>
                    <p>ua</p>
                    <DebounceInput debounceTimeout={config.debounce} value={config.ua} onChange={this.uaChange}/>
                </div>
            </div>
        )
    }
}


class ItemsList extends React.Component {
    render() {
        return (
            config.items.slice(0, config.showLines).map((item, index) => {
                return(
                    <div key={index} className="items-list">
                        <div>{item.time}</div>
                        <div>{item.ip}</div>
                        <div>{item.host}</div>
                        <div>{item.path}</div>
                        <div>{item.ua}</div>
                    </div>
                )
            })
        );
    }
}

class Logger extends React.Component {
    state = {params: '', url: 'http://localhost:5000/stream-file'};
    abortController = new AbortController();

    componentDidMount() {
        config.paramsChanged = () => {
            const params = config.getParamsUrl();
            if(params !== this.state.params) {
                this.setState({params: params});
                this.abortController.abort();
                this.getData();
            }
        };
        config.itemsConfigChanged = () => {
            this.setState({});
        };
        config.reloadRequest = () => {
            this.abortController.abort();
            this.getData();
        };
        this.getData();
    }

    getData() {
        config.clearItems();
        this.abortController = new AbortController();
        fetch(this.state.url + this.state.params, {signal: this.abortController.signal, method: 'GET'})
            .then(response => this.getStream(response.body.getReader()))
            .catch(err => console.log('Filters reloaded without incoming results'))
    }

    getStream(reader) {
        return new ReadableStream({
            start(controller) {
                return getChunk();
                function getChunk() {
                    return reader.read().then(({ done, value }) => {
                        if (done) {
                            controller.close();
                            return;
                        }
                        config.parseStreamResponse(String.fromCharCode.apply(null, value));
                        return getChunk();
                    });
                }
            }
        })
    }

    render() {
        return (
            <div>
                <Settings/>
                <hr/>
                <Filer/>
                <ItemsList/>
            </div>
        );
    }

}