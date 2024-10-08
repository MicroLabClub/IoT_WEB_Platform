/*
 * Copyright 2021 HiveMQ GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import mqtt from 'mqtt';
import mysql from "mysql2"


// your credentials
const options = {
  username: 'sergiu.doncila',
  password: 'QWEasd!@#123',
  host: '9b7b323ee67e46d18f9317162c8e8841.s1.eu.hivemq.cloud',
  port: 8883,
  protocol: 'mqtts',
};

// connect to your cluster
let client = mqtt.connect(options);

client.on('connect', mqtt_connected);
client.on('reconnect', mqtt_reconnect);
client.on('error', mqtt_error);
client.on('close', mqtt_close);
client.on('message', mqtt_messsageReceived);

let humTime = 6000;
let tempTime = 5000;
let batteryTime = 5000;
let flowerNumberingTime = 5000;

let chargingPowerTime = 5000;
let chargingPowerTimeInterval = null;

let pVoltageTime = 5000;
let pVoltageInterval = null;

let timeInterval = null;
let humInterval = null;
let batteryInterval = null;
let flowerNumberingInterval = null;

let batteryLevel = 100;

//receive a message from MQTT broker
function mqtt_messsageReceived(topic, message, packet) {
  console.log('Received message on topic:', topic); 
  var message_str = message.toString(); //convert byte array to string
  console.log("message to string", message_str);
  let table_name = "messages_mqqt";

  if(topic == "microlab/agro/device/ventilation/settings"){
    console.log("settings topic");
    console.log(message_str);
    //console.log(JSON.parse(message_str).humTime);
    //console.log(JSON.parse(message_str).tempTime);
    clearInterval(humInterval);
    humTime = JSON.parse(message_str).humTime *30000;
    setHumInterval(humTime);

    clearInterval(timeInterval);
    tempTime = JSON.parse(message_str).tempTime * 30000;
    setTempInterval(tempTime);

  } else if (topic === "microlab/automotive/device/drone/battery"){
    console.log("settings topic");
    console.log(message_str);

    clearInterval(batteryInterval);
    let receivedBatteryTime = JSON.parse(message_str).batteryTime * 1000;
    setBatteryInterval(receivedBatteryTime);

  } else if(topic === "microlab/automotive/device/drone/flowerNumbering"){
    console.log("settings topic");
    console.log(message_str);

    clearInterval(flowerNumberingInterval);
    let receivedFlowerNumberingTime = JSON.parse(message_str).flowerNumberingTime * 1000;
    setFlowerNumberingInterval(receivedFlowerNumberingTime);

  } else if (topic == "microlab/agro/device/invertor/chargingPower"){
    console.log("settings topic");
    clearInterval(chargingPowerTimeInterval);
    chargingPowerTime = JSON.parse(message_str).chargingPowerTime *3000;
    console.log(chargingPowerTime);
    setChargingPowerInterval(chargingPowerTime);
  } else if (topic == "microlab/agro/device/invertor/pVoltage"){
    console.log("settings topic");
    clearInterval(pVoltageInterval);
    pVoltageTime = JSON.parse(message_str).pVoltageTime *3000;
    console.log(pVoltageTime);
    setPVoltageInterval(pVoltageTime);
  
  } else{
    try {
      insert_message(topic, message, table_name);
    } catch(e){
      console.log("Error on sql insert message : ", e.message);
    }
  }  
}

//insert a row into the db table
function insert_message(topic, message, table_name) {
  let jsonMessage = JSON.parse(message); 
  let sensor_id = jsonMessage.sensor_id;
  let device_id = jsonMessage.device_id;
  let date= new Date();
  let sql = "INSERT INTO ?? (??,??,??,??,??,??) VALUES (?,?,?,?,?,?)";
  let params = [table_name, 'message_id', 'sensor_id', 'device_id', 'topic', 'message','date', null, sensor_id, device_id, topic, message, date];
  sql = mysql.format(sql, params);    

  connection.query(sql, function (error, results) {
      if (error) throw error;
      console.log("Message added: " , results.insertId);
  }); 
}


function mqtt_connected(){
  console.log("Connected to MQTT");
}

function mqtt_reconnect(err) {
  console.log("Reconnect MQTT");
  if (err) {console.log(err);}
  client  = mqtt.connect(options);
}

function mqtt_close() {
  console.log("Close MQTT");
}

function mqtt_error(err) {
  console.log("MQTT Error:",err);
}

function mqtt_subscribe(err, Topic) {
  console.log("Subscribed to " + JSON.stringify(Topic));
  if (err) {console.log(err);}
}


// subscribe and publish to the same topic
client.subscribe('agrobot/sensors/#', mqtt_subscribe);
client.subscribe('microlab/agro/#', mqtt_subscribe);
//client.subscribe('microlab/automotive/#', mqtt_subscribe);
//client.subscribe('microlab/agro/light/intensity', mqtt_subscribe);
//client.subscribe('microlab/agro/air/temperature', mqtt_subscribe);

function setTempInterval(tempTime){
  timeInterval = setInterval(function () {
    let tc = Math.floor((Math.random() * 100) + 1);
    client.publish('agrobot/sensors/temperature/sensor-1', JSON.stringify({'temp': tc, 'sensor_id':1}));
  }, tempTime);
}

function setHumInterval(humTime){
    humInterval = setInterval(function () {
      let tc = Math.floor((Math.random() * 10) + 1);
      client.publish('agrobot/sensors/temperature/sensor-2', JSON.stringify({'hum': tc, 'sensor_id':1}));
    }, humTime);
}

function decreaseBatteryLevel() {
  batteryInterval = setInterval(function () {
    if (batteryLevel > 0) {
      batteryLevel -= 1;
      client.publish('microlab/automotive/device/drone/battery-1', JSON.stringify({ 'battery': batteryLevel, 'device_id': 2 }));
    } else {
      clearInterval(batteryInterval);
    }
  }, batteryTime);
}

function setBatteryInterval(batteryTime) {
  batteryInterval = setInterval(function () {
    let tc = Math.floor((Math.random() * 10) + 1);
    client.publish('microlab/automotive/device/drone/battery-1', JSON.stringify({ 'battery': tc, 'device_id': 2 }));
  }, batteryTime);
}

function setFlowerNumberingInterval(flowerNumberingTime) {
  flowerNumberingInterval = setInterval(function () {
    let tc = Math.floor((Math.random() * 10) + 1);
    client.publish('microlab/automotive/device/drone/flowerNumbering-1', JSON.stringify({ 'flowerNumbering': tc, 'device_id': 2 }));
  }, flowerNumberingTime);
}

function setChargingPowerInterval(chargingPowerTime){
  chargingPowerTimeInterval = setInterval(function () {
    let tc = Math.floor((Math.random() * 10) + 1);
    client.publish('microlab/agro/device/invertor/chargingPower-1', JSON.stringify({'chargingPower': tc, 'sensor_id':1}));
  }, chargingPowerTime);
}

function setPVoltageInterval(chargingPowerTime){
  pVoltageInterval = setInterval(function () {
    let tc = Math.floor((Math.random() * 10) + 1);
    client.publish('microlab/agro/device/invertor/pVoltage-1', JSON.stringify({'pVoltage': tc, 'sensor_id':1}));
  }, pVoltageTime);
}

setTempInterval(tempTime);
setHumInterval(humTime);
setBatteryInterval(batteryTime);
decreaseBatteryLevel()
setFlowerNumberingInterval(flowerNumberingTime);
setChargingPowerInterval(chargingPowerTime);
setPVoltageInterval(pVoltageTime)

//testing
import connection from "./db.js";import { clearInterval } from 'timers';

