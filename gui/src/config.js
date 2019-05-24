export class Config {
    constructor() {
        this.timeoutCounter = null;
        this.reloadRequest = null;
        this.itemsConfigChanged = null;
        this.paramsChanged = null;
        this.items = [];
        this.buffer = 1000;
        this.showLines = 15;
        this.debounce = 500;
        this.idleTime = 600000;
        this.time = '';
        this.ip = '';
        this.host = '';
        this.path = '';
        this.ua = '';
        this.resetIdle();
    }

    parseStreamResponse(value) {
        value.split('\n')
            .slice(0,-1)
            .forEach(el => {
                    if(this.items.length > this.buffer - 1) {
                        this.items.pop();
                    }
                    this.items.unshift(JSON.parse(el));
                }
            );
        this.resetIdle();
        this.itemsConfigChanged();
    }

    bufferChanged(event) {
        this.buffer = event.target.value;
        if (this.buffer && this.items.length > this.buffer) {
            this.items.splice(this.buffer);
        }
        this.itemsConfigChanged();
    }

     showLinesChanged(event) {
         this.showLines = event.target.value;
         this.itemsConfigChanged();
    }

    timeChange(event) {
        this.time = event.target.value;
        this.paramsChanged();
    }

    ipChange(event) {
        this.ip = event.target.value;
        this.paramsChanged();
    }

    hostChange(event) {
        this.host = event.target.value;
        this.paramsChanged();
    }

    pathChange(event) {
        this.path = event.target.value;
        this.paramsChanged();
    }

    uaChange(event) {
        this.ua = event.target.value;
        this.paramsChanged();
    }

    clearItems() {
        this.items = [];
    }

    resetIdle() {
        if(this.timeoutCounter) {
            clearTimeout(this.timeoutCounter);
        }
        this.timeoutCounter = setTimeout(() => {
            console.log('Long time idle hit. Requesting data again');
            this.resetIdle();
            this.reloadRequest();
        }, this.idleTime);
    }

    getParamsUrl() {
        let params = '';
        if(this.time !== '') params = params + '&time=' + this.time;
        if(this.ip !== '') params = params + '&ip=' + this.ip;
        if(this.host !== '') params =  params + '&host=' + this.host;
        if(this.path !== '') params =  params + '&path=' + this.path;
        if(this.ua !== '') params =  params + '&ua=' + this.ua;
        if(params !== '') params = '?' + params.slice(1,params.length);
        return params;
    }

}