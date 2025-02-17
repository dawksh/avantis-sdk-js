import IntegratedClient from "./clients/IntegratedClient";

class AvantisSDK {
    constructor(client: IntegratedClient) {
        this.client = client;
    }

    public client: IntegratedClient;


    async getPairs() {

    }
}

export default AvantisSDK