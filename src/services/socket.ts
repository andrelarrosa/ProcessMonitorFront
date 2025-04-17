import { HubConnectionBuilder } from '@microsoft/signalr';

const connection = new HubConnectionBuilder()
  .withUrl('http://localhost:5112/processhub')
  .withAutomaticReconnect()
  .build();

export default connection;