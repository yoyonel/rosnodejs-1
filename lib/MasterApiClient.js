/*
 *    Copyright 2016 Rethink Robotics
 *
 *    Copyright 2016 Chris Smith
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

"use strict";

let xmlrpc = require('xmlrpc');
let networkUtils = require('../utils/network_utils.js');
let Logging = require('./Logging.js');
let xmlrpcUtils = require('../utils/xmlrpc_utils.js');

//-----------------------------------------------------------------------

class MasterApiClient {

  constructor(rosMasterUri, logName) {
    this._log = Logging.getLogger(Logging.DEFAULT_LOGGER_NAME + '.masterapi');
    this._log.info('Connecting to ROS Master at ' + rosMasterUri);
    this._xmlrpcClient = xmlrpc.createClient(networkUtils.getAddressAndPortFromUri(rosMasterUri));
  };

  getXmlrpcClient() {
    return this._xmlrpcClient;
  }

  _call(method, data, resolve, reject) {
    xmlrpcUtils.call(this.getXmlrpcClient(), method, data, resolve, reject, this._log);
  }

  registerService(callerId, service, serviceUri, uri) {
    let data = [
      callerId,
      service,
      serviceUri,
      uri
    ];

    return new Promise((resolve, reject) => {
      this._call('registerService', data, resolve, reject);
    });
  }

  unregisterService(callerId, service, serviceUri) {
    let data = [
      callerId,
      service,
      serviceUri
    ];

    return new Promise((resolve, reject) => {
      this._call('unregisterService', data, resolve, reject);
    });
  }

  registerSubscriber(callerId, topic, topicType, uri) {
    let data = [
      callerId,
      topic,
      topicType,
      uri
    ];
    return new Promise((resolve, reject) => {
      this._call('registerSubscriber', data, resolve, reject);
    });
  }

  unregisterSubscriber(callerId, topic, uri) {
    let data = [
      callerId,
      topic,
      uri
    ];
    return new Promise((resolve, reject) => {
      this._call('unregisterSubscriber', data, resolve, reject);
    });
  }

  registerPublisher(callerId, topic, topicType, uri) {
    let data = [
      callerId,
      topic,
      topicType,
      uri
    ];
    return new Promise((resolve, reject) => {
      this._call('registerPublisher', data, resolve, reject);
    });
  }

  unregisterPublisher(callerId, topic, uri) {
    let data = [
      callerId,
      topic,
      uri
    ];
    return new Promise((resolve, reject) => {
      this._call('unregisterPublisher', data, resolve, reject);
    });
  }

  lookupNode(callerId, nodeName) {
    let data = [callerId, nodeName];
    return new Promise((resolve, reject) => {
      this._call('lookupNode', data, resolve, reject);
    });
  }

  getPublishedTopics(callerId, subgraph) {
    throw new Error('NOT SUPPORTED');
  }

  getTopicTypes(callerId) {
    throw new Error('NOT SUPPORTED');
  }

  /** return an object containing all current publishers (by topic),
      subscribers (by topic), and services (by name) */
  getSystemState(callerId) {
    function toObject(memo, sublist) {
      memo[sublist[0]] = sublist[1];
      return memo;
    }
    let data = [callerId];
    return new Promise((resolve, reject) => {
      this._call('getSystemState', data, function(data) {
        return resolve({
          publishers: data[2][0].reduce(toObject, {}),
          subscribers: data[2][1].reduce(toObject, {}),
          services: data[2][2].reduce(toObject, {})
        });
      }, reject);
    });
  }

  getUri(callerId) {
    let data = [callerId];
    return new Promise((resolve, reject) => {
      this._call('getUri', data, resolve, reject);
    });
  }

  lookupService(callerId, service) {
    let data = [callerId, service];
    return new Promise((resolve, reject) => {
      this._call('lookupService', data, resolve, reject);
    });
  }
};

//-----------------------------------------------------------------------

module.exports = MasterApiClient;
